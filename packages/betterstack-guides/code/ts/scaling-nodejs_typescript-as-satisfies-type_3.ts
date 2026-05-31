# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label annotation-validation.ts]
interface User {
  id: string;
  name: string;
  email: string;
}

const user: User = {
  id: "123",
  name: "John"
  // Error: Property 'email' is missing
};

const invalidUser: User = {
  id: 123, // Error: Type 'number' not assignable to 'string'
  name: "John",
  email: "john@example.com"
};