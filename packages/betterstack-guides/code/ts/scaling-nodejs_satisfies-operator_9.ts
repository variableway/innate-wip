# Source: https://betterstack.com/community/guides/scaling-nodejs/satisfies-operator/
# Original language: typescript
# Normalized: ts
# Block index: 9

[label src/config.ts]
type Colors = "red" | "green" | "blue";
type RGB = [red: number, green: number, blue: number];

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
[highlight]
  yellow: "#ffff00"
[/highlight]
} satisfies Record<Colors, string | RGB>;

const greenUpper = palette.green.toUpperCase();
console.log(greenUpper);