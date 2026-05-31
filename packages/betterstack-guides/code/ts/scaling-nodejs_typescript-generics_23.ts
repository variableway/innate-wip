# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 23

type NonNullable<T> = T extends null | undefined ? never : T;

// Examples
type A = NonNullable<string>;        // string
type B = NonNullable<string | null>; // string
type C = NonNullable<null>;          // never

// A more practical example
function process<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("Value cannot be null or undefined");
  }
  return value as NonNullable<T>;
}

const result1 = process("hello");  // Type: string
const result2 = process(42);       // Type: number
// This would throw at runtime
// const result3 = process(null);