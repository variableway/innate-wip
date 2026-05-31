# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 0

import { Type, Static } from '@sinclair/typebox'

const UserSchema = Type.Object({
  id: Type.Number(),
  email: Type.String({ format: 'email' }),
  name: Type.String({ minLength: 2 })
})

// Get TypeScript type
type User = Static<typeof UserSchema>