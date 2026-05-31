# Source: https://betterstack.com/community/guides/scaling-nodejs/satisfies-operator/
# Original language: typescript
# Normalized: ts
# Block index: 6

[label src/config.ts]
type Colors = "red" | "green" | "blue";
type RGB = [red: number, green: number, blue: number];

[highlight]
// Remove type annotation and use satisfies to preserve exact types
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255]
} satisfies Record<Colors, string | RGB>;
[/highlight]

// Now TypeScript knows green is specifically a string
const greenUpper = palette.green.toUpperCase();
console.log(greenUpper);