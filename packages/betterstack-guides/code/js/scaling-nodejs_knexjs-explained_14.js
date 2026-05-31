# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 14

// Find books with JavaScript in the title
const jsBooks = await db('books')
  .where('title', 'like', '%JavaScript%')
  .select('title', 'author');