# Source: https://betterstack.com/community/guides/scaling-nodejs/sequelize-orm/
# Original language: javascript
# Normalized: js
# Block index: 14

// Order books by price (cheapest first)
const orderedBooks = await Book.findAll({
  order: [
    ['price', 'ASC']
  ]
});