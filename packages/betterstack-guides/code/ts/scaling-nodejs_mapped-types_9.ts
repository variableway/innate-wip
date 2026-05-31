# Source: https://betterstack.com/community/guides/scaling-nodejs/mapped-types/
# Original language: typescript
# Normalized: ts
# Block index: 9

[label src/utilities.ts]
// Make all properties nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

// Make specific properties optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface Product {
  id: number;
  name: string;
  price: number;
}

// All properties can be null (for database results)
type NullableProduct = Nullable<Product>;

const dbProduct: NullableProduct = {
  id: 1,
  name: "Laptop",
  price: null  // Valid - might be missing in DB
};

// Only specific properties are optional
type ProductInput = PartialBy<Product, "id">;

const newProduct: ProductInput = {
  name: "Mouse",
  price: 25
  // id is optional
};

console.log("Database product:", dbProduct);
console.log("New product input:", newProduct);