# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-interfaces/
# Original language: typescript
# Normalized: ts
# Block index: 10

interface Point {
  x: number;
  y: number;
}

function distance(p: Point): number {
  return Math.sqrt(p.x * p.x + p.y * p.y);
}

// Works without explicit declaration
const point = { x: 3, y: 4 };
console.log(distance(point)); // Valid