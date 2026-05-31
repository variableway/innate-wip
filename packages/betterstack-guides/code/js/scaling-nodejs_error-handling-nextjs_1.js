# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nextjs/
# Original language: javascript
# Normalized: js
# Block index: 1

[label pages/products/[id].js]
import ErrorBoundary from '@/components/ErrorBoundary';
import ProductDetails from '@/components/ProductDetails';
import RelatedProducts from '@/components/RelatedProducts';
import ProductReviews from '@/components/ProductReviews';

export default function ProductPage({ product }) {
  return (
    <div className="product-page">
      <h1>Product Details</h1>
      
      {/* Isolate the main product display errors */}
      <ErrorBoundary fallback={<div>Failed to display product</div>}>
        <ProductDetails product={product} />
      </ErrorBoundary>
      
      {/* Separate boundary for related products section */}
      <ErrorBoundary fallback={<div>Unable to load related products</div>}>
        <RelatedProducts productId={product.id} />
      </ErrorBoundary>
      
      {/* Another boundary for reviews section */}
      <ErrorBoundary fallback={<div>Reviews temporarily unavailable</div>}>
        <ProductReviews productId={product.id} />
      </ErrorBoundary>
    </div>
  );
}