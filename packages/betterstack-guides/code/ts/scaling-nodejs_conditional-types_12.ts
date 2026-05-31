# Source: https://betterstack.com/community/guides/scaling-nodejs/conditional-types/
# Original language: typescript
# Normalized: ts
# Block index: 12

[label src/infer.ts]
...
// This should error - wrong type for user
const badUser: CreateUserReturn = {
  id: "wrong",
  name: "John",
  email: "john@example.com"
};