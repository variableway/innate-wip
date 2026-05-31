# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 24

[label type-inference-advanced.ts]
function prop<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const user = {
  name: "Alice",
  age: 30,
  isAdmin: true
};

const name = prop(user, "name");    // TypeScript infers 'string'
const age = prop(user, "age");      // TypeScript infers 'number'
const isAdmin = prop(user, "isAdmin");  // TypeScript infers 'boolean'

// This would cause a compile-time error
// const invalid = prop(user, "invalid");  // Error: 'invalid' is not assignable to parameter of type 'keyof { name: string; age: number; isAdmin: boolean; }'