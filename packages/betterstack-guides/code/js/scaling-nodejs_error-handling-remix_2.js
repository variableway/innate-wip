# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-remix/
# Original language: javascript
# Normalized: js
# Block index: 2

export async function loader({ params }) {
  const product = await db.product.findUnique({
    where: { id: params.productId },
  });
  
  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }
  
  return json({ product });
}