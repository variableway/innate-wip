# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 8

function reverseArray<T>(array: T[]): T[] {
  return [...array].reverse();
}

const numbers = reverseArray([1, 2, 3, 4]);             // Type: number[]
const strings = reverseArray(["a", "b", "c"]);          // Type: string[]
const mixed = reverseArray([1, "two", 3, "four"]);      // Type: (string | number)[]