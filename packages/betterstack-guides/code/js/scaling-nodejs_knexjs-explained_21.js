# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 21

// Apply 10% discount to all books over $30
const discounted = await db('books')
  .where('price', '>', 30)
  .update({
    price: db.raw('ROUND(price * 0.9, 2)'),
    updated_at: db.fn.now()
  });