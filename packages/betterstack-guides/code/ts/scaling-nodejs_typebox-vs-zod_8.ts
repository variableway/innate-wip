# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 8

import { Type, Static } from '@sinclair/typebox'

const UserSchema = Type.Object({
  id: Type.Number(),
  email: Type.String(),
  age: Type.Optional(Type.Number())
})

// Generate TypeScript type
type User = Static<typeof UserSchema>