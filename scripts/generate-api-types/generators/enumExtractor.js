const { normalizeEnumValues } = require('../utils/schema');

/**
 * Generate enum type name from schema name and property path
 * @param {string} schemaName - The schema name (e.g., "DriverScheduleDto")
 * @param {string} path - The property path (e.g., "status")
 * @returns {string} - The generated enum type name (e.g., "DriverScheduleStatus")
 */
function generateEnumTypeName(schemaName, path) {
  if (!path || !schemaName) {
    return schemaName ? schemaName.replace(/Dto$/, '') : 'Enum';
  }

  // Extract property name from path (last part)
  const propertyName = path.split('.').pop();
  // Remove "Dto" suffix from schema name if present
  let schemaBaseName = schemaName.replace(/Dto$/, '');

  // Remove redundancy: common patterns where property name contains schema word
  // e.g., "scheduleType" in "DriverSchedule" -> "DriverScheduleType"
  // e.g., "slotType" in "DriverScheduleTimeSlot" -> "DriverScheduleTimeSlotType"
  let cleanedProperty = propertyName;

  // Split schema name into words (camelCase)
  const schemaWords = schemaBaseName.split(/(?=[A-Z])/).map(w => w.toLowerCase());

  // Check if property name starts with any schema word (case-insensitive)
  for (const word of schemaWords) {
    const regex = new RegExp(`^${word}`, 'i');
    if (regex.test(cleanedProperty)) {
      // Remove the redundant word from property
      cleanedProperty = cleanedProperty.replace(regex, '');
      break;
    }
  }

  // If property is empty after cleaning, use the original property name
  if (!cleanedProperty) {
    cleanedProperty = propertyName;
  }

  // Capitalize the cleaned property name
  const capitalizedProperty = cleanedProperty.charAt(0).toUpperCase() + cleanedProperty.slice(1);

  // Generate: SchemaName + CleanedPropertyName
  return schemaBaseName + capitalizedProperty;
}

/**
 * Extract inline enums from a schema recursively
 * @param {Object} schema - The schema to extract from
 * @param {string} schemaName - The name of the schema
 * @param {string} path - The current property path
 * @param {Object} enumSchemas - Map of enum schemas (to skip)
 * @param {Object} inlineEnums - Map to store extracted enums
 * @param {Object} enumPropertyMap - Map of property paths to enum type names
 */
function extractInlineEnums(
  schema,
  schemaName,
  path = '',
  enumSchemas,
  inlineEnums,
  enumPropertyMap,
) {
  if (!schema || typeof schema !== 'object') return;

  // Check if this schema itself is an enum
  if (
    schema.type === 'string' &&
    schema.enum &&
    Array.isArray(schema.enum) &&
    schema.enum.length > 0
  ) {
    // Skip if it's already in enumSchemas (separate enum schema)
    if (enumSchemas[schemaName]) return;

    const enumTypeName = generateEnumTypeName(schemaName, path);
    const normalizedValues = normalizeEnumValues(schema.enum);

    // Check if we already have this enum with the same values
    let existingEnumName = null;
    for (const [existingName, existingValues] of Object.entries(inlineEnums)) {
      const normalizedExisting = normalizeEnumValues(existingValues);
      if (normalizedExisting === normalizedValues) {
        existingEnumName = existingName;
        break;
      }
    }

    if (existingEnumName) {
      // Use existing enum type
      enumPropertyMap[path || schemaName] = existingEnumName;
    } else {
      // Create new enum type
      inlineEnums[enumTypeName] = schema.enum;
      enumPropertyMap[path || schemaName] = enumTypeName;
    }
    return;
  }

  // Recursively check properties
  if (schema.properties) {
    Object.entries(schema.properties).forEach(([propName, propSchema]) => {
      const newPath = path ? `${path}.${propName}` : propName;
      extractInlineEnums(
        propSchema,
        schemaName,
        newPath,
        enumSchemas,
        inlineEnums,
        enumPropertyMap,
      );
    });
  }

  // Check items for arrays
  if (schema.items) {
    extractInlineEnums(schema.items, schemaName, path, enumSchemas, inlineEnums, enumPropertyMap);
  }

  // Check allOf, anyOf, oneOf
  if (schema.allOf) {
    schema.allOf.forEach(subSchema =>
      extractInlineEnums(subSchema, schemaName, path, enumSchemas, inlineEnums, enumPropertyMap),
    );
  }
  if (schema.anyOf) {
    schema.anyOf.forEach(subSchema =>
      extractInlineEnums(subSchema, schemaName, path, enumSchemas, inlineEnums, enumPropertyMap),
    );
  }
  if (schema.oneOf) {
    schema.oneOf.forEach(subSchema =>
      extractInlineEnums(subSchema, schemaName, path, enumSchemas, inlineEnums, enumPropertyMap),
    );
  }
}

/**
 * Extract all inline enums from schemas
 * @param {Object} schemas - All schemas from OpenAPI
 * @param {Object} enumSchemas - Map of enum schemas (to skip)
 * @returns {Object} - Map of enum type names to enum values
 */
function extractAllInlineEnums(schemas, enumSchemas) {
  const inlineEnums = {};
  const enumPropertyMap = {};

  // Extract inline enums from all schemas
  Object.entries(schemas).forEach(([schemaName, schema]) => {
    // Skip enum schemas (already handled)
    if (enumSchemas[schemaName]) return;
    extractInlineEnums(schema, schemaName, '', enumSchemas, inlineEnums, enumPropertyMap);
  });

  return inlineEnums;
}

module.exports = {
  extractAllInlineEnums,
  generateEnumTypeName,
};
