# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-tuple-types/
# Original language: typescript
# Normalized: ts
# Block index: 7

[label src/problem.ts]
// Tuple type - enforces exactly 2 numbers
function parseCoordinate(input: string): 
[highlight]
[number, number]
[/highlight]
{
  const parts = input.split(",");
  return [parseFloat(parts[0]!), parseFloat(parts[1]!)];
}

function calculateDistance(point: 
[highlight]
[number, number]
[/highlight]
): number {
  const [x, y] = point;
  return Math.sqrt(x * x + y * y);
}

const point = parseCoordinate("3,4");
console.log("Distance:", calculateDistance(point));

// These errors are now caught:
const badPoint1: [number, number, number] = [10, 20, 30];
const badPoint2: [number] = [10];

console.log("Bad distance 1:", calculateDistance(badPoint1));
console.log("Bad distance 2:", calculateDistance(badPoint2));