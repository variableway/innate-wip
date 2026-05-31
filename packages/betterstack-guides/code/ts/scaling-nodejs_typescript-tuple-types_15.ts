# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-tuple-types/
# Original language: typescript
# Normalized: ts
# Block index: 15

[label src/labeled.ts]
// Labeled tuple types
type HTTPResponse = [status: number, body: string, headers: Record<string, string>];
type RGB = [red: number, green: number, blue: number];
type Coordinate = [x: number, y: number, z?: number];

function createResponse(status: number, body: string): HTTPResponse {
  return [status, body, { "Content-Type": "text/plain" }];
}

function colorToHex(color: RGB): string {
  const [red, green, blue] = color;
  return `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
}

function distanceFromOrigin(point: Coordinate): number {
  const [x, y, z = 0] = point;
  return Math.sqrt(x * x + y * y + z * z);
}

const response = createResponse(200, "Success");
console.log("Response status:", response[0]);
console.log("Response body:", response[1]);

const color: RGB = [255, 128, 64];
console.log("Hex color:", colorToHex(color));

const point2D: Coordinate = [3, 4];
const point3D: Coordinate = [3, 4, 5];
console.log("2D distance:", distanceFromOrigin(point2D));
console.log("3D distance:", distanceFromOrigin(point3D));