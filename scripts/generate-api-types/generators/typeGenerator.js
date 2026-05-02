const { schemaToTypeScript } = require('./schemaToTypeScript');
const { extractAllInlineEnums } = require('./enumExtractor');

/** Map duplicate schema names (Nelmio "2" suffix) to explicit names. Backend should set model names in nelmio_api_doc.models.names. */
const SCHEMA_NAME_ALIAS = {
  User2: 'UserRead',
  Organization2: 'OrganizationRef',
  PrivateCustomer2: 'PrivateCustomerRef',
  UserTenant2: 'UserTenantRead',
  UuidV63: 'UuidV62',
};

const BASE_TYPES = `export interface IHistoryEndpoint {
  createdAt: string;
  updateAt: string;
}

export type AddressType = 'pickup' | 'delivery';
export type CustomerType = 'organization' | 'private_customer';
export type IPricingType = 'distance' | 'city';
`;

/**
 * Identify all enum schemas from OpenAPI
 * @param {Object} schemas - All schemas from OpenAPI
 * @returns {Object} - Map of enum schema names to their values
 */
function identifyEnumSchemas(schemas) {
  const enumSchemas = {};
  Object.entries(schemas).forEach(([schemaName, schema]) => {
    if (
      schema.type === 'string' &&
      schema.enum &&
      Array.isArray(schema.enum) &&
      schema.enum.length > 0
    ) {
      enumSchemas[schemaName] = schema.enum;
    }
  });
  return enumSchemas;
}

/**
 * Generate enum types output
 * @param {Object} enumSchemas - Map of enum schema names to their values
 * @param {Object} inlineEnums - Map of inline enum type names to their values
 * @returns {string} - TypeScript enum types output
 */
function generateEnumTypes(enumSchemas, inlineEnums) {
  let output = '';

  // Generate enum schemas
  const enumTypeNames = Object.keys(enumSchemas).sort();
  if (enumTypeNames.length > 0) {
    output += '\n// Enum Types (generated from OpenAPI enum schemas)\n';
    enumTypeNames.forEach(schemaName => {
      const enumValues = enumSchemas[schemaName];
      const enumType = enumValues.map(v => `"${v}"`).join(' | ');
      output += `export type ${schemaName} = ${enumType};\n`;
    });
    output += '\n';
  }

  // Generate inline enum types
  const inlineEnumNames = Object.keys(inlineEnums).sort();
  if (inlineEnumNames.length > 0) {
    output += '\n// Enum Types (extracted from inline enum properties in OpenAPI schemas)\n';
    inlineEnumNames.forEach(enumName => {
      const enumValues = inlineEnums[enumName];
      const enumType = enumValues.map(v => `"${v}"`).join(' | ');
      output += `export type ${enumName} = ${enumType};\n`;
    });
    output += '\n';
  }

  return output;
}

/**
 * Generate interface output
 * @param {string} name - Schema name
 * @param {Object} schema - Schema object
 * @param {Object} schemas - All schemas
 * @param {Object} enumSchemas - Enum schemas
 * @param {Object} inlineEnums - Inline enums
 * @returns {string} - TypeScript interface output
 */
function generateInterface(name, schema, schemas, enumSchemas, inlineEnums) {
  const displayName = SCHEMA_NAME_ALIAS[name] || name;
  const interfaceName = displayName.startsWith('I') ? displayName : `I${displayName}`;
  let typeScript = schemaToTypeScript(
    schema,
    schemas,
    new Set(),
    enumSchemas,
    inlineEnums,
    SCHEMA_NAME_ALIAS,
  );

  const hasHistoryFields =
    schema.properties &&
    schema.properties.createdAt &&
    schema.properties.updateAt &&
    (!schema.required ||
      (schema.required.includes('createdAt') && schema.required.includes('updatedAt')));

  // Remove unnecessary parentheses from typeScript
  typeScript = typeScript.replace(/\(([A-Z][a-zA-Z0-9_]*)\)/g, '$1');

  if (hasHistoryFields && !typeScript.includes('IHistoryEndpoint')) {
    return `export interface ${interfaceName} extends IHistoryEndpoint ${typeScript}\n\n`;
  } else {
    return `export interface ${interfaceName} ${typeScript}\n\n`;
  }
}

/**
 * Generate API response types
 * @param {Object} paths - OpenAPI paths
 * @param {Object} schemas - All schemas
 * @param {Object} enumSchemas - Enum schemas
 * @param {Object} inlineEnums - Inline enums
 * @returns {string} - TypeScript API response types output
 */
function generateApiResponseTypes(paths, schemas, enumSchemas, inlineEnums) {
  let output = '\n// API Response Types\n';

  Object.entries(paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, operation]) => {
      if (method === 'parameters') return;

      let operationId =
        operation.operationId || `${method}_${path.replace(/\//g, '_').replace(/[{}]/g, '')}`;
      operationId = operationId.replace(/\./g, '_');
      // Snake-case operationId → PascalCase TypeScript type name. Generated
      // type ends up as e.g. `GetAdminPlanVersionReadResponse` instead of
      // `get_admin_plan_version_readResponse`, matching TS convention.
      const typeName = operationId
        .split('_')
        .filter(Boolean)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join('');
      const responses = operation.responses || {};
      const successResponse = responses['200'] || responses['201'] || responses['204'];

      if (successResponse && successResponse.content) {
        const jsonContent = successResponse.content['application/json'];
        if (jsonContent && jsonContent.schema) {
          let responseType = schemaToTypeScript(
            jsonContent.schema,
            schemas,
            new Set(),
            enumSchemas,
            inlineEnums,
            SCHEMA_NAME_ALIAS,
          );
          // Remove unnecessary parentheses
          responseType = responseType.replace(/^\((.*)\)$/, '$1');
          responseType = responseType.replace(/\(([A-Z][a-zA-Z0-9_]*)\)/g, '$1');
          // Apply schema name aliases (e.g. IUser2 → IUserRead)
          Object.entries(SCHEMA_NAME_ALIAS).forEach(([from, to]) => {
            responseType = responseType.replace(
              new RegExp(`I${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'),
              `I${to}`,
            );
          });
          output += `export type ${typeName}Response = ${responseType};\n`;
        }
      }
    });
  });

  return output;
}

/**
 * Generate all TypeScript types from OpenAPI spec
 * @param {Object} spec - OpenAPI specification
 * @returns {string} - Complete TypeScript types output
 */
function generateTypes(spec) {
  const components = spec.components || {};
  const schemas = components.schemas || {};

  let output = `// ⚠️ This file is auto-generated. Do not edit manually.

${BASE_TYPES}
`;

  // Step 1: Identify enum schemas
  const enumSchemas = identifyEnumSchemas(schemas);

  // Step 2: Extract inline enums
  const inlineEnums = extractAllInlineEnums(schemas, enumSchemas);

  // Step 3: Generate enum types
  output += generateEnumTypes(enumSchemas, inlineEnums);

  // Step 4: Generate interfaces (deduplicate by display name so alias and original don't both output same name)
  const sortedSchemas = Object.entries(schemas)
    .filter(([name]) => !enumSchemas[name]) // Exclude enum schemas
    .filter(([name]) => !name.startsWith('UuidV6') && name !== 'Uuid') // UUIDs resolve to string
    .sort(([a], [b]) => a.localeCompare(b));
  const outputInterfaceNames = new Set();
  sortedSchemas.forEach(([name, schema]) => {
    const displayName = SCHEMA_NAME_ALIAS[name] || name;
    const interfaceName = displayName.startsWith('I') ? displayName : `I${displayName}`;
    if (outputInterfaceNames.has(interfaceName)) return;
    outputInterfaceNames.add(interfaceName);
    output += generateInterface(name, schema, schemas, enumSchemas, inlineEnums);
  });

  // Step 5: Generate API response types
  const paths = spec.paths || {};
  if (Object.keys(paths).length > 0) {
    output += generateApiResponseTypes(paths, schemas, enumSchemas, inlineEnums);
  }

  return output;
}

module.exports = { generateTypes };
