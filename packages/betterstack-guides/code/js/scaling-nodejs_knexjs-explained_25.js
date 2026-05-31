# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 25

// Delete a book by ID
await db('books')
  .where('id', 3)
  .del();