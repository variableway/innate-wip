# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-optional-properties/
# Original language: typescript
# Normalized: ts
# Block index: 13

[label src/strict.ts]
function displayProduct(product: Product) {
  console.log(product.name.toUpperCase());
  [highlight]
  console.log(product.description?.trim() ?? 'No description');
  [/highlight]
}
...