# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions-casting/
# Original language: typescript
# Normalized: ts
# Block index: 21

function isString(value: unknown): value is string {
  return typeof value === "string";
}

if (isString(value)) {
  // TypeScript knows value is string here
  console.log(value.toUpperCase());
}