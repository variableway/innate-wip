# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nextjs/
# Original language: javascript
# Normalized: js
# Block index: 9

[label app/products/page.js]
export default async function ProductsPage() {
  try {
    const products = await fetchProducts();
    
    if (products.length === 0) {
      return <div>No products available</div>;
    }
    
    return <ProductList products={products} />;
  } catch (error) {
    console.error('Product fetch error:', error);
    return <div>Failed to load products</div>;
  }
}