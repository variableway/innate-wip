# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 19

// Increase price by 10%
await db('books')
  .where('id', bookId)
  .update({
    price: db.raw('ROUND(price * 1.1, 2)')
  });