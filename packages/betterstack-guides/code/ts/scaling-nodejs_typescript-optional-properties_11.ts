# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-optional-properties/
# Original language: typescript
# Normalized: ts
# Block index: 11

[label src/strict.ts]
interface Product {
  id: number;
  name: string;
  description: string | null;
}

function displayProduct(product: Product) {
  console.log(product.name.toUpperCase());
  console.log(product.description.trim());  // Error with strictNullChecks
}

const product: Product = {
  id: 1,
  name: "Laptop",
  description: null
};

displayProduct(product);