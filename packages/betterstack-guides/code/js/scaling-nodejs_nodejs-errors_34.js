# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/
# Original language: javascript
# Normalized: js
# Block index: 34

import fs from 'node:fs';

[highlight]
if (!fs.existsSync('temp')) {
[/highlight]
  fs.mkdirSync('temp', (err) => {
    if (err) throw err;
  });
}