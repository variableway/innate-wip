# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-tuple-types/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/problem.ts]
// Regular array - loses position-specific type information
function parseCoordinate(input: string): number[] {
  const parts = input.split(",");
  return [parseFloat(parts[0]), parseFloat(parts[1])];
}

function calculateDistance(point: number[]): number {
  const x = point[0];
  const y = point[1];
  return Math.sqrt(x * x + y * y);
}

const point = parseCoordinate("3,4");
console.log("Distance:", calculateDistance(point));

// These errors go undetected:
const badPoint1 = [10, 20, 30];  // Too many elements
const badPoint2 = [10];           // Too few elements

console.log("Bad distance 1:", calculateDistance(badPoint1));
console.log("Bad distance 2:", calculateDistance(badPoint2));