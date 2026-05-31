# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nextjs/
# Original language: javascript
# Normalized: js
# Block index: 11

[label app/products/page.js]
import ErrorableProductList from '@/components/ErrorableProductList';

export default async function ProductsPage() {
  try {
    const products = await fetchProducts();
    return <ErrorableProductList products={products} />;
  } catch (error) {
    return <ErrorableProductList error={error} />;
  }
}