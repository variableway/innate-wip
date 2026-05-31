# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-joi/
# Original language: javascript
# Normalized: js
# Block index: 14

// Optimize validation performance
const schema = Joi.object({
  // schema definition
}).options({ abortEarly: true });