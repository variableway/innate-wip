# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 11

[label related-properties.ts]
type ColorConfig = 
  | { type: "hex"; value: string }
  | { type: "rgb"; value: { r: number; g: number; b: number } };

interface Theme {
  primary: ColorConfig;
  secondary: ColorConfig;
}

const theme = {
  primary: { type: "hex", value: "#ff0000" },
  secondary: { type: "rgb", value: { r: 0, g: 255, b: 0 } }
} satisfies Theme;

// TypeScript knows primary.type is exactly "hex"
if (theme.primary.type === "hex") {
  console.log(theme.primary.value); // Type: string
}