# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 14

function identity<T>(arg: T): T {
  return arg;
}

// No need to specify <number> - TypeScript infers it
const num = identity(42);

// You can specify it explicitly if needed
const str = identity<string>("hello");