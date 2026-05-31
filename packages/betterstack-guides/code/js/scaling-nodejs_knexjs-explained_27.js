# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 27

// Delete books in a specific price range
await db('books')
  .where('price', '>', 20)
  .andWhere('price', '<', 30)
  .del();