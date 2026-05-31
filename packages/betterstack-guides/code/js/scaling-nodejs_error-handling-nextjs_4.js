# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nextjs/
# Original language: javascript
# Normalized: js
# Block index: 4

[label pages/api/products/[id].js]
export default async function handler(req, res) {
  try {
    // Method validation
    if (req.method !== 'GET') {
      return res.status(405).json({ 
        success: false,
        error: 'Method not allowed'
      });
    }
    
    const { id } = req.query;
    
    // Input validation
    if (!id || !/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }
    
    try {
      const product = await fetchProduct(id);
      
      if (!product) {
        return res.status(404).json({ 
          success: false,
          error: 'Product not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: product
      });
    } catch (fetchError) {
      // Handle external service errors
      if (fetchError.code === 'ECONNREFUSED') {
        return res.status(503).json({
          success: false,
          error: 'Service temporarily unavailable'
        });
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      requestId: `req_${Date.now().toString(36)}`
    });
  }
}