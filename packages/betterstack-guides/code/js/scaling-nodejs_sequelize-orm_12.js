# Source: https://betterstack.com/community/guides/scaling-nodejs/sequelize-orm/
# Original language: javascript
# Normalized: js
# Block index: 12

// Query books by a specific author
const crockfordBooks = await Book.findAll({
  where: {
    author: "Douglas Crockford"
  }
});