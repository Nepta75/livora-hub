#!/usr/bin/env node

/**
 * Script pour générer les types TypeScript depuis l'API OpenAPI
 * Usage: node scripts/generate-api-types.js [api-url]
 */

const fs = require('fs');
const path = require('path');
const { fetchOpenAPISpec } = require('./generate-api-types/utils/http');
const { generateTypes } = require('./generate-api-types/generators/typeGenerator');

const API_URL =
  process.argv[2] ||
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_HOST ||
  'http://localhost:8000';
const OUTPUT_FILE = path.join(__dirname, '../src/types/generated/api-types.ts');

async function main() {
  const openApiUrl = `${API_URL}/api/doc.json`;

  console.log(`📥 Fetching OpenAPI spec from ${openApiUrl}...`);

  try {
    const spec = await fetchOpenAPISpec(openApiUrl);
    console.log('✅ OpenAPI spec fetched successfully');

    console.log('🔨 Generating TypeScript types...');
    const types = generateTypes(spec);

    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, types, 'utf-8');
    console.log(`✅ Types generated successfully: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Make sure your API is running and accessible at:', openApiUrl);
    console.error(
      '\n💡 You can set API_URL environment variable:',
      'API_URL=http://localhost:8000 yarn generate:api-types',
    );
    if (process.env.CI || process.env.FORCE_GENERATE_TYPES) {
      process.exit(1);
    }
    console.warn('⚠️  Continuing without type generation (non-CI environment)');
  }
}

main();
