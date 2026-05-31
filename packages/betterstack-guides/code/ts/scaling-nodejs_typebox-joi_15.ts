# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-joi/
# Original language: typescript
# Normalized: ts
# Block index: 15

// Configure Ajv for maximum performance
const ajv = new Ajv({ allErrors: false });
const validate = ajv.compile(UserSchema);