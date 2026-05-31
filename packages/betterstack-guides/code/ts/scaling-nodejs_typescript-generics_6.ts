# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 6

function identity<T>(arg: T): T {
  return arg;
}

// Usage
const num = identity(42);        // TypeScript infers type 'number'
const str = identity("hello");   // TypeScript infers type 'string'
const bool = identity(true);     // TypeScript infers type 'boolean'