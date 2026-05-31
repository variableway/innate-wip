# Source: https://betterstack.com/community/guides/scaling-nodejs/oxlint-vs-eslint/
# Original language: typescript
# Normalized: ts
# Block index: 11

[label processData.ts]
// Oxlint warns: no-explicit-any
function processData(data: any) {
  return data.map((item: any) => item.value);
}