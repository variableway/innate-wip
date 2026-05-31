# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 11

// Get a book by its ID
const bookById = await db('books')
  .where('id', 2)
  .first();