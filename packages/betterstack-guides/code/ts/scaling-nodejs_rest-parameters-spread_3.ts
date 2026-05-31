# Source: https://betterstack.com/community/guides/scaling-nodejs/rest-parameters-spread/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/problem.ts]
// Attempt 1: Using arguments object (untyped)
function sum1() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

// Attempt 2: Multiple overloads (doesn't scale)
function sum2(a: number): number;
function sum2(a: number, b: number): number;
function sum2(a: number, b: number, c: number): number;
function sum2(...args: number[]): number {
  return args.reduce((sum, n) => sum + n, 0);
}

console.log("Sum1:", sum1(1, 2, 3));
console.log("Sum2:", sum2(1, 2, 3));