# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-explained/
# Original language: typescript
# Normalized: ts
# Block index: 16

[label nested-schemas.ts]
import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

// Define a schema for an Address
const AddressSchema = Type.Object({
  street: Type.String(),
  city: Type.String()
});

// User schema with nested address and tags
const UserSchema = Type.Object({
  name: Type.String(),
  address: AddressSchema, // Nested object
  tags: Type.Array(Type.String()) // Array
});

// Create and validate a user
const user = {
  name: 'Jane Doe',
  address: {
    street: '123 Main St',
    city: 'Anytown'
  },
  tags: ['developer', 'typescript']
};

const validator = TypeCompiler.Compile(UserSchema);
console.log('Valid user:', validator.Check(user));