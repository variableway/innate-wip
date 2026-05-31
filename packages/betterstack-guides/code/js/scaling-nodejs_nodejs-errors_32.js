# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/
# Original language: javascript
# Normalized: js
# Block index: 32

import fs from 'node:fs';

fs.mkdirSync('temp', (err) => {
  if (err) throw err;
});