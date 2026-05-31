# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 13

[label as-vs-satisfies-safety.ts]
type Color = "red" | "green" | "blue";

// as allows completely invalid values
const color1 = "purple" as Color; // No error
const color2 = 123 as Color; // No error
const color3 = { invalid: true } as Color; // No error

// satisfies catches all invalid values
const color4 = "purple" satisfies Color; // Error
const color5 = 123 satisfies Color; // Error
const color6 = { invalid: true } satisfies Color; // Error