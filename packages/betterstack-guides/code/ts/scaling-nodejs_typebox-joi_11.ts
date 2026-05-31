# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-joi/
# Original language: typescript
# Normalized: ts
# Block index: 11

const Role = Type.Union([
  Type.Literal('admin'),
  Type.Literal('user'),
  Type.Literal('guest')
]);

// Becomes the type: 'admin' | 'user' | 'guest'
type UserRole = Static<typeof Role>;