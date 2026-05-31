# Source: https://betterstack.com/community/guides/scaling-nodejs/pnpm-explained/
# Original language: javascript
# Normalized: js
# Block index: 12

[label phantom.js]
// With PNPM, this should fail because we didn't install mime-types
try {
  const mime = require('mime-types');
  console.log('Successfully loaded mime-types:', mime.lookup('json'));
} catch (e) {
  console.error('Failed to load mime-types:', e.message);
}