# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 5

[label legitimate-assertions.ts]
// TypeScript knows this returns HTMLElement, not the specific type
const input = document.getElementById("email") as HTMLInputElement;
const canvas = document.querySelector("canvas") as HTMLCanvasElement;

// Working with third-party libraries with loose types
const chart = createChart(options) as SpecificChartType;