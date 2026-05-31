# Source: https://betterstack.com/community/guides/scaling-nodejs/ajv-validation/
# Original language: javascript
# Normalized: js
# Block index: 19

import Ajv from "ajv";
const ajv = new Ajv({ 
  allErrors: true,
[highlight]
  useDefaults: true  // Enable default values
[/highlight]
});