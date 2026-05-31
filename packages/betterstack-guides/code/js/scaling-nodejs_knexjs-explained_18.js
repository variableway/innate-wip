# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 18

// Update multiple fields at once
await db('books')
  .where('id', bookId)
  .update({
    title: 'Updated Title',
    price: 39.99,
    stock: 20
  });