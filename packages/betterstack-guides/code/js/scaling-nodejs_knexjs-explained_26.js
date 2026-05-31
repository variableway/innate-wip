# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 26

// Delete books with low stock
await db('books')
  .where('stock', '<', 5)
  .del();