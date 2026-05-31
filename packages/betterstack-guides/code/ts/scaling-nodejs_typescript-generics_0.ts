# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 0

function getFirstElement(arr: any[]): any {
  return arr[0];
}

const numbers = [1, 2, 3];
const firstNumber = getFirstElement(numbers);

const names = ["Alice", "Bob", "Charlie"];
const firstName = getFirstElement(names);