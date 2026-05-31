# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 15

function map<T, U>(array: T[], fn: (item: T) => U): U[] {
  return array.map(fn);
}

const numbers = [1, 2, 3, 4];
const doubled = map(numbers, n => n * 2);            // Type: number[]
const stringified = map(numbers, n => n.toString()); // Type: string[]