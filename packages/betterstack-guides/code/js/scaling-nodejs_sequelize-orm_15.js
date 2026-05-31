# Source: https://betterstack.com/community/guides/scaling-nodejs/sequelize-orm/
# Original language: javascript
# Normalized: js
# Block index: 15

// Order by price in descending order (most expensive first)
const expensiveFirst = await Book.findAll({
  order: [
    ['price', 'DESC']
  ]
});