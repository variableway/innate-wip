# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 4

[label assertion-bypass.ts]
const user = {
  id: "123",
  name: "John"
} as User; // No error, despite missing email

const invalidUser = {
  id: 123,
  name: "John",
  email: "john@example.com"
} as User; // No error, despite wrong id type