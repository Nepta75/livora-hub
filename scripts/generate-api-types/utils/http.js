const https = require('https');
const http = require('http');

/**
 * Fetch OpenAPI specification from URL
 * @param {string} url - The URL to fetch from
 * @returns {Promise<Object>} - The parsed JSON spec
 */
function fetchOpenAPISpec(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    const urlObj = new URL(url);
    if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
      urlObj.hostname = '127.0.0.1';
      url = urlObj.toString();
    }

    const options = {
      family: 4, // Force IPv4
    };

    client
      .get(url, options, res => {
        let data = '';

        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          return;
        }

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${e.message}`));
          }
        });
      })
      .on('error', err => {
        reject(err);
      });
  });
}

module.exports = { fetchOpenAPISpec };
