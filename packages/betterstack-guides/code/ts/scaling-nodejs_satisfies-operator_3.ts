# Source: https://betterstack.com/community/guides/scaling-nodejs/satisfies-operator/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/config.ts]
type Colors = "red" | "green" | "blue";
type RGB = [red: number, green: number, blue: number];

const palette: Record<Colors, string | RGB> = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255]
};

// Try to use string methods on green
const greenUpper = palette.green.toUpperCase();
console.log(greenUpper);