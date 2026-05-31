# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-runtime/
# Original language: javascript
# Normalized: js
# Block index: 21

[label advanced-loader.js]
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, {
  // Enable filesystem caching - this is crucial for performance
  cache: true,
  
  // Control Node.js require cache behavior
  requireCache: false,
  
  // Better compatibility between CommonJS and ES modules
  interopDefault: true,
  
  // Debug mode - shows what Jiti is doing behind the scenes
  debug: process.env.NODE_ENV === 'development',
  
  // Source maps for better error messages and debugging
  sourcemap: true
});

export default jiti;