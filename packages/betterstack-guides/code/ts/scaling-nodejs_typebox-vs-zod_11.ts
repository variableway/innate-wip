# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 11

function processUser(data: unknown) {
  const user = userSchema.parse(data)
  // TypeScript knows user is User type here
  return user.id
}