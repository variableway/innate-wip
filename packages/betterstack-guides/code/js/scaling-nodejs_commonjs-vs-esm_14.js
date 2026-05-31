# Source: https://betterstack.com/community/guides/scaling-nodejs/commonjs-vs-esm/
# Original language: javascript
# Normalized: js
# Block index: 14

const cjsModule = await import('./commonjs-file.cjs');
console.log(cjsModule.default);