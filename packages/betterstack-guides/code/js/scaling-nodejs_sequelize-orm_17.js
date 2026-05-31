# Source: https://betterstack.com/community/guides/scaling-nodejs/sequelize-orm/
# Original language: javascript
# Normalized: js
# Block index: 17

// Get a specific book by ID
const bookById = await Book.findByPk(2);