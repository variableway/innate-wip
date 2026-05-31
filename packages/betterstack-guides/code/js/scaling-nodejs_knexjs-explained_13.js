# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 13

// Count the total number of books
const bookCount = await db('books').count('id as count').first();

// Get the average price
const avgPrice = await db('books')
  .avg('price as avgPrice')
  .first();