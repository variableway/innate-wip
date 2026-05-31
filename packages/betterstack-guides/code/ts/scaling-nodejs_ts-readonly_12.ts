# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-readonly/
# Original language: typescript
# Normalized: ts
# Block index: 12

[label src/comparison.ts]
interface Point {
  readonly x: number;
  readonly y: number;
}

// const: prevents reassignment only
const constPoint = { x: 10, y: 20 };
constPoint.x = 30;  // Allowed - properties are mutable

// Object.freeze: runtime immutability
const frozenPoint = Object.freeze({ x: 10, y: 20 });
// frozenPoint.x = 30;  // Fails at runtime in strict mode

// readonly: compile-time immutability
const readonlyPoint: Point = { x: 10, y: 20 };
// readonlyPoint.x = 30;  // Error - compile-time enforcement

console.log("const point:", constPoint);
console.log("frozen point:", frozenPoint);
console.log("readonly point:", readonlyPoint);