# Source: https://betterstack.com/community/guides/scaling-nodejs/conditional-types/
# Original language: typescript
# Normalized: ts
# Block index: 18

[label src/utilities.ts]
...
// This should error - missing required properties
const invalidUser: User = { id: 3, name: "Bob" };