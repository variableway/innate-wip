# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-tuple-types/
# Original language: typescript
# Normalized: ts
# Block index: 10

[label src/optional.ts]
// Tuple with optional third element
type Point2D = [number, number];
type Point3D = [number, number, number?];

function createPoint(x: number, y: number, z?: number): Point3D {
  return z !== undefined ? [x, y, z] : [x, y];
}

function getDistance(point: Point3D): number {
  const [x, y, z] = point;
  if (z !== undefined) {
    return Math.sqrt(x * x + y * y + z * z);
  }
  return Math.sqrt(x * x + y * y);
}

// Both 2D and 3D points work
const point2D = createPoint(3, 4);
const point3D = createPoint(3, 4, 5);

console.log("2D distance:", getDistance(point2D));
console.log("3D distance:", getDistance(point3D));

// Optional return values pattern
type Result<T> = [T, null] | [null, Error];

function parseJSON(input: string): Result<object> {
  try {
    const data = JSON.parse(input);
    return [data, null];
  } catch (error) {
    return [null, error as Error];
  }
}

const [data, error] = parseJSON('{"name": "Alice"}');
if (error) {
  console.log("Parse error:", error.message);
} else {
  console.log("Parsed data:", data);
}