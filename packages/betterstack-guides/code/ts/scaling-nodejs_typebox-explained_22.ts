# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-explained/
# Original language: typescript
# Normalized: ts
# Block index: 22

[label error-formatting.ts]
import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

// Define a schema for a registration form
const RegistrationSchema = Type.Object({
  username: Type.String({ minLength: 3, maxLength: 20 }),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
  age: Type.Number({ minimum: 18 })
});

// Invalid registration data
const invalidData = {
  username: 'jo', // Too short
  email: 'not-an-email',
  password: 'short',
  age: 16 // Too young
};

// Validate the data
const validator = TypeCompiler.Compile(RegistrationSchema);
const isValid = validator.Check(invalidData);

if (!isValid) {
  // Get raw errors
  const errors = [...validator.Errors(invalidData)];
  console.log('Raw validation errors:', errors);
}