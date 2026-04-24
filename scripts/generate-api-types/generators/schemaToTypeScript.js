const { resolveRef, findMatchingEnumSchema, normalizeEnumValues } = require('../utils/schema');

/**
 * Convert OpenAPI schema to TypeScript type string
 * @param {Object} schema - The OpenAPI schema
 * @param {Object} definitions - All schema definitions
 * @param {Set} visited - Set of visited schema names (to prevent circular refs)
 * @param {Object} enumSchemas - Map of enum schema names to their values
 * @param {Object} inlineEnums - Map of inline enum type names to their values
 * @returns {string} - TypeScript type string
 */
function schemaToTypeScript(
  schema,
  definitions = {},
  visited = new Set(),
  enumSchemas = {},
  inlineEnums = {},
  schemaNameAlias = {},
) {
  if (!schema) return 'unknown';

  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop();
    const displayRefName = schemaNameAlias[refName] || refName;

    if (refName.startsWith('UuidV6') || refName === 'Uuid') {
      return 'string';
    }

    // Check if this is an enum schema - enums don't use "I" prefix
    if (enumSchemas[refName]) {
      return refName;
    }

    const typeName = displayRefName.startsWith('I') ? displayRefName : `I${displayRefName}`;

    if (visited.has(refName)) {
      return typeName;
    }

    const resolved = resolveRef(schema.$ref, definitions);
    if (resolved) {
      visited.add(refName);
      const result = schemaToTypeScript(
        resolved,
        definitions,
        visited,
        enumSchemas,
        inlineEnums,
        schemaNameAlias,
      );
      visited.delete(refName);
      return result;
    }

    return typeName;
  }

  if (schema.allOf) {
    const types = schema.allOf.map(s =>
      schemaToTypeScript(s, definitions, visited, enumSchemas, inlineEnums, schemaNameAlias),
    );
    const result = types.join(' & ');
    // Remove unnecessary parentheses around intersection types
    return result.replace(/^\((.*)\)$/, '$1');
  }

  if (schema.anyOf || schema.oneOf) {
    const types = (schema.anyOf || schema.oneOf).map(s => {
      let type = schemaToTypeScript(
        s,
        definitions,
        visited,
        enumSchemas,
        inlineEnums,
        schemaNameAlias,
      );
      // Remove unnecessary parentheses
      type = type.replace(/^\((.*)\)$/, '$1');
      return type;
    });
    // Only add parentheses if needed (multiple types)
    const unionType = types.join(' | ');
    return types.length > 1 ? `(${unionType})` : unionType;
  }

  if (schema.type === 'string') {
    if (schema.format === 'uuid') return 'string';
    if (schema.format === 'date-time' || schema.format === 'date') return 'string';
    if (schema.enum) {
      // Check if this enum matches an existing enum schema
      const matchingEnumSchema = findMatchingEnumSchema(schema.enum, enumSchemas);
      if (matchingEnumSchema) {
        return matchingEnumSchema;
      }
      // Check if this enum matches an inline enum type
      const normalizedValues = normalizeEnumValues(schema.enum);
      for (const [enumName, enumValues] of Object.entries(inlineEnums)) {
        const normalizedExisting = normalizeEnumValues(enumValues);
        if (normalizedExisting === normalizedValues) {
          return enumName;
        }
      }
      // Format enum on multiple lines if too long (for Prettier)
      const enumStr = schema.enum.map(v => `'${v}'`).join(' | ');
      if (enumStr.length > 80) {
        return '\n    | ' + schema.enum.map(v => `'${v}'`).join('\n    | ');
      }
      return enumStr;
    }
    return 'string';
  }

  if (schema.type === 'integer' || schema.type === 'number') {
    return 'number';
  }

  if (schema.type === 'boolean') {
    return 'boolean';
  }

  if (schema.type === 'array') {
    // Handle empty items object (common in OpenAPI for untyped arrays)
    if (
      !schema.items ||
      (typeof schema.items === 'object' && Object.keys(schema.items).length === 0)
    ) {
      return 'unknown[]';
    }
    const itemsType = schemaToTypeScript(
      schema.items,
      definitions,
      visited,
      enumSchemas,
      inlineEnums,
      schemaNameAlias,
    );
    return `${itemsType}[]`;
  }

  if (schema.type === 'object' || schema.properties) {
    const props = schema.properties || {};
    const required = schema.required || [];

    const typeProps = Object.entries(props)
      .map(([key, propSchema]) => {
        const isOptional = !required.includes(key);
        let propType = schemaToTypeScript(
          propSchema,
          definitions,
          visited,
          enumSchemas,
          inlineEnums,
          schemaNameAlias,
        );
        // Remove unnecessary parentheses around types
        propType = propType.replace(/^\((.*)\)$/, '$1');
        if (propSchema.nullable === true && !propType.includes('null')) {
          propType = `${propType} | null`;
        }
        return `  ${key}${isOptional ? '?' : ''}: ${propType};`;
      })
      .join('\n');

    if (typeProps.trim() === '') {
      return '{ [key: string]: unknown }';
    }

    return `{\n${typeProps}\n}`;
  }

  return 'unknown';
}

module.exports = { schemaToTypeScript };
