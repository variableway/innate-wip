# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-explained/
# Original language: typescript
# Normalized: ts
# Block index: 5

[label index.ts]
import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

// Define a schema for a User
const UserSchema = Type.Object({
  name: Type.String(),
  age: Type.Number(),
  email: Type.String()
});

// Sample user data
const userData = {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com'
};

// Compile the schema for validation
const validator = TypeCompiler.Compile(UserSchema);

// Validate the data
const result = validator.Check(userData);

console.log('Is valid?', result);