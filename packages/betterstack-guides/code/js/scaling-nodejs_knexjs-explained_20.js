# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 20

// Reduce stock by 3
await db('books')
  .where('id', bookId)
  .decrement('stock', 3);

// Increase price by $2.50
await db('books')
  .where('author', 'Kyle Simpson')
  .increment('price', 2.50);