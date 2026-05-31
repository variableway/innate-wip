# Source: https://betterstack.com/community/guides/scaling-nodejs/rest-parameters-spread/
# Original language: typescript
# Normalized: ts
# Block index: 10

[label src/problem.ts]
[highlight]
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}
[/highlight]

// Attempt 2: Multiple overloads (doesn't scale)
function sum2(a: number): number;
function sum2(a: number, b: number): number;
function sum2(a: number, b: number, c: number): number;
function sum2(...args: number[]): number {
  return args.reduce((sum, n) => sum + n, 0);
}

[highlight]
console.log("Sum:", sum(1, 2, 3));
[/highlight]
console.log("Sum2:", sum2(1, 2, 3));