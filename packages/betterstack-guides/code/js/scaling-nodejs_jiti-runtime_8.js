# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-runtime/
# Original language: javascript
# Normalized: js
# Block index: 8

[label mixed-import.js]
import jiti from './loader.js';

// Import CommonJS module - Jiti converts it automatically
const config = jiti('./commonjs-module.js');
console.log('CommonJS config:', config);

// Import ESM TypeScript module - Jiti compiles TypeScript and handles ES modules
const esmModule = jiti('./esm-module.ts');
console.log('ESM module:', esmModule);