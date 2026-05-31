# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-joi/
# Original language: typescript
# Normalized: ts
# Block index: 10

import { Type, Static } from '@sinclair/typebox';

const UserSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  age: Type.Number({ minimum: 18 })
});

// TypeScript type automatically derived from schema
type User = Static<typeof UserSchema>;

function processUser(data: unknown): User {
  const validate = ajv.compile(UserSchema);
  if (!validate(data)) throw new Error('Invalid data');
  return data as User;
}