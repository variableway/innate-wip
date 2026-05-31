# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-explained/
# Original language: typescript
# Normalized: ts
# Block index: 7

import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

// Define a schema with constraints
const UserSchema = Type.Object({
[highlight]
  name: Type.String({ minLength: 2, maxLength: 50 }),
  age: Type.Number({ minimum: 18, maximum: 120 }),
  email: Type.String({ format: 'email' })
[/highlight]
});

// Valid user data
const userData = {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com'
};

[highlight]
// Invalid user data
const invalidUser = {
  name: 'J', // Too short
  age: 16,   // Below minimum
  email: 'not-an-email' // Invalid format
};

// Compile the schema
const validator = TypeCompiler.Compile(UserSchema);

// Validate both users
console.log('Valid user:', validator.Check(userData));
console.log('Invalid user:', validator.Check(invalidUser));

// Get validation errors
if (!validator.Check(invalidUser)) {
  console.log('Validation errors:', [...validator.Errors(invalidUser)]);
}
[/highlight]