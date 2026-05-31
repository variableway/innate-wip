# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-ts-node-typescript/
# Original language: javascript
# Normalized: js
# Block index: 17

// Jiti prioritizes speed, optional type checking
const jiti = createJiti(import.meta.url, {
  // Type checking happens via separate tools
  // Jiti focuses on fast transpilation
});