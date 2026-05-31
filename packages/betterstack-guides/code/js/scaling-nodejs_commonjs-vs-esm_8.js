# Source: https://betterstack.com/community/guides/scaling-nodejs/commonjs-vs-esm/
# Original language: javascript
# Normalized: js
# Block index: 8

const resolvedPath = import.meta.resolve('./someFile.js');
console.log(resolvedPath);