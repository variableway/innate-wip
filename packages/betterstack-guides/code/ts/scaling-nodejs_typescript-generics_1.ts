# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 1

function getFirstElement<T>(arr: T[]): T {
  return arr[0];
}

const numbers = [1, 2, 3];
const firstNumber = getFirstElement(numbers); // TypeScript knows this is a number

const names = ["Alice", "Bob", "Charlie"];
const firstName = getFirstElement(names); // TypeScript knows this is a string