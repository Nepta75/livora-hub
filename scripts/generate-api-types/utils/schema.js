/**
 * Resolve a $ref reference in OpenAPI schema
 * @param {string} ref - The reference string (e.g., "#/components/schemas/User")
 * @param {Object} definitions - The definitions object to resolve from
 * @returns {Object|null} - The resolved schema or null
 */
function resolveRef(ref, definitions) {
  if (!ref || !ref.startsWith('#/')) return null;
  const parts = ref.split('/');
  let current = definitions;
  for (let i = 1; i < parts.length; i++) {
    current = current[parts[i]];
    if (!current) return null;
  }
  return current;
}

/**
 * Check if an enum array matches an existing enum schema
 * @param {string[]} enumValues - The enum values to check
 * @param {Object} enumSchemas - Map of enum schema names to their enum values
 * @returns {string|null} - The matching enum schema name, or null
 */
function findMatchingEnumSchema(enumValues, enumSchemas) {
  const normalizedValues = [...enumValues].sort().join('|');
  for (const [schemaName, schemaEnumValues] of Object.entries(enumSchemas)) {
    const normalizedSchemaValues = [...schemaEnumValues].sort().join('|');
    if (normalizedValues === normalizedSchemaValues) {
      return schemaName;
    }
  }
  return null;
}

/**
 * Normalize enum values for comparison
 * @param {string[]} enumValues - The enum values
 * @returns {string} - Normalized string for comparison
 */
function normalizeEnumValues(enumValues) {
  return [...enumValues].sort().join('|');
}

module.exports = {
  resolveRef,
  findMatchingEnumSchema,
  normalizeEnumValues,
};
