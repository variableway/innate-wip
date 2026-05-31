# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 28

// Delete books by specific authors
await db('books')
  .whereIn('author', ['Douglas Crockford', 'Kyle Simpson'])
  .del();