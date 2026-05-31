# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 10

// Get books under $30
const affordableBooks = await db('books')
  .where('price', '<', 30)
  .select('title', 'author', 'price');