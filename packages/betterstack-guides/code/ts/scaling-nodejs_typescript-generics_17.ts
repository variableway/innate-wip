# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 17

function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

// All these work because they have a 'length' property
const stringLength = getLength("hello");        // Works with strings
const arrayLength = getLength([1, 2, 3]);       // Works with arrays
const objectLength = getLength({ length: 10 }); // Works with objects that have a length

// This would fail
// getLength(123);  // Error: Number doesn't have a 'length' property