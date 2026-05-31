# Source: https://betterstack.com/community/guides/scaling-nodejs/index/
# Original language: javascript
# Normalized: js
# Block index: 11

[label main.js]
import Ajv from "ajv";
[highlight]
const ajv = new Ajv({ coerceTypes: true });
[/highlight]

// Rest of the code stays the same