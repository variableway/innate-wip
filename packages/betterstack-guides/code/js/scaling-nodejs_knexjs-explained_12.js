# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 12

// Order books by price (highest first)
const expensiveFirst = await db('books')
  .select('title', 'price')
  .orderBy('price', 'desc');