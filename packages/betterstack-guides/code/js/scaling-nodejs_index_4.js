# Source: https://betterstack.com/community/guides/scaling-nodejs/index/
# Original language: javascript
# Normalized: js
# Block index: 4

[label test-ajv.js]
import Ajv from "ajv";
const ajv = new Ajv();

console.log("Ajv version:", ajv.opts.code.es5 ? "Using ES5 code" : "Using ES6+ code");