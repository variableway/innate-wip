# Source: https://betterstack.com/community/guides/scaling-nodejs/commonjs-vs-esm/
# Original language: javascript
# Normalized: js
# Block index: 7

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);
console.log(__filename);