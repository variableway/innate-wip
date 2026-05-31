# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 22

[label return-types.ts]
// Good: explicit return type
function getUser(id: string): User {
  return { id, name: "John", email: "john@example.com" };
}

// Avoid: inferred return type
function getUser(id: string) {
  return { id, name: "John", email: "john@example.com" };
}