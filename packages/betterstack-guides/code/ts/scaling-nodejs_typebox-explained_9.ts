# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-explained/
# Original language: typescript
# Normalized: ts
# Block index: 9

[label type-inference.ts]
import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

// Define a schema
const UserSchema = Type.Object({
  name: Type.String(),
  age: Type.Number(),
  email: Type.String(),
  isActive: Type.Boolean()
});

// Extract TypeScript type from schema
type User = typeof UserSchema.static;

// Create a user with the correct types
const user: User = {
  name: 'Jane Doe',
  age: 30,
  email: 'jane@example.com',
  isActive: true
};

console.log('User created successfully:', user);