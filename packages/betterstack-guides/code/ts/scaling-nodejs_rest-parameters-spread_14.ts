# Source: https://betterstack.com/community/guides/scaling-nodejs/rest-parameters-spread/
# Original language: typescript
# Normalized: ts
# Block index: 14

[label src/spread-arrays.ts]
function calculateTotal(base: number, tax: number, shipping: number): number {
  return base + tax + shipping;
}

const costs: [number, number, number] = [100, 15, 10];

// Spread array into function arguments
console.log("Total:", calculateTotal(...costs));

// Combining arrays
const numbers1 = [1, 2, 3];
const numbers2 = [4, 5, 6];
const combined = [...numbers1, ...numbers2];
console.log("Combined:", combined);

// Copying arrays
const original = [1, 2, 3];
const copy = [...original];
console.log("Original:", original);
console.log("Copy:", copy);

// Adding elements while spreading
const base = [2, 3, 4];
const extended = [1, ...base, 5];
console.log("Extended:", extended);