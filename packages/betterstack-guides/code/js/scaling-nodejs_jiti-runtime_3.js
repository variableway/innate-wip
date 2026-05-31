# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-runtime/
# Original language: javascript
# Normalized: js
# Block index: 3

[label index.js]
import jiti from './loader.js';

// Load a TypeScript file at runtime
const result = jiti('./example.ts');
console.log('Loaded:', result);