# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-joi/
# Original language: typescript
# Normalized: ts
# Block index: 8

ajv.addKeyword({
  keyword: 'notBlacklisted',
  validate: (schema, data) => !isBlacklisted(data)
});

const SafeString = Type.String({ notBlacklisted: true });