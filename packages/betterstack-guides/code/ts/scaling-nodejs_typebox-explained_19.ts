# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-explained/
# Original language: typescript
# Normalized: ts
# Block index: 19

[label custom-validation.ts]
import { Type, FormatRegistry } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

// Register a custom format for product codes (ABC-12345)
FormatRegistry.Set('product-code', (value) => {
  return /^[A-Z]{3}-\d{5}$/.test(value);
});

// Schema using the custom format
const ProductSchema = Type.Object({
  name: Type.String(),
  code: Type.String({ format: 'product-code' }),
  price: Type.Number({ minimum: 0 })
});

// Create a product with a valid code
const product = {
  name: 'Widget',
  code: 'ABC-12345',
  price: 29.99
};

// Validate the product
const validator = TypeCompiler.Compile(ProductSchema);
console.log('Valid product:', validator.Check(product));

// Try an invalid product code
const invalidProduct = {
  name: 'Gadget',
  code: 'AB-12345', // Wrong format (only 2 letters)
  price: 19.99
};

console.log('Invalid product:', validator.Check(invalidProduct));