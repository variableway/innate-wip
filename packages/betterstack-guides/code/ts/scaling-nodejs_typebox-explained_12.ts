# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-explained/
# Original language: typescript
# Normalized: ts
# Block index: 12

[label type-inference.ts]
...
// This will cause TypeScript compilation errors
const badUser: User = {
  name: 'John',
  age: '25', // Error: string is not assignable to number
  email: 'john@example.com',
  isActive: 'yes' // Error: string is not assignable to boolean
};