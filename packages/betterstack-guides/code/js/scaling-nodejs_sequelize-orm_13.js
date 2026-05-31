# Source: https://betterstack.com/community/guides/scaling-nodejs/sequelize-orm/
# Original language: javascript
# Normalized: js
# Block index: 13

// Query books with price less than $30
const affordableBooks = await Book.findAll({
  where: {
    price: {
      [Op.lt]: 30.00
    }
  }
});