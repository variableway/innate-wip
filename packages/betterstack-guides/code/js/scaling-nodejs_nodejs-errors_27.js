# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/
# Original language: javascript
# Normalized: js
# Block index: 27

import fs from 'node:fs';

fs.readFile('/etc/sudoers', (err, data) => {
  if (err) throw err;
  console.log(data);
});