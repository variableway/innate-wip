# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-utility-types/
# Original language: typescript
# Normalized: ts
# Block index: 9

[label src/forms.ts]
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
};

// Form types derived from Product
type ProductForm = Omit<Product, 'id'>; // Create form - everything except ID
type ProductUpdate = Partial<Pick<Product, 'name' | 'description' | 'price'>>; // Optional updates

// Simple form validation
function validateProduct(data: ProductForm): string[] {
  const errors: string[] = [];
  if (!data.name) errors.push('Name is required');
  if (data.price <= 0) errors.push('Price must be positive');
  return errors;
}

// Test the form types
const newProduct: ProductForm = {
  name: 'Laptop',
  description: 'Gaming laptop',
  price: 1200,
  category: 'Electronics',
  inStock: true
};

const productUpdate: ProductUpdate = {
  name: 'Updated Laptop',
  price: 1100
  // description and other fields are optional
};

const errors = validateProduct(newProduct);
console.log('Validation errors:', errors);
console.log('New product:', newProduct);
console.log('Update data:', productUpdate);