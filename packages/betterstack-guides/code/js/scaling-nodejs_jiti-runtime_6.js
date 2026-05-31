# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-runtime/
# Original language: javascript
# Normalized: js
# Block index: 6

[label commonjs-module.js]
// CommonJS module
const config = {
  database: {
    host: 'localhost',
    port: 5432
  },
  api: {
    version: 'v1',
    timeout: 5000
  }
};

module.exports = config;