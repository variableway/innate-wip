# Source: https://betterstack.com/community/guides/scaling-nodejs/sequelize-orm/
# Original language: javascript
# Normalized: js
# Block index: 22

// Bulk update - increase prices of all books under $30 by 10%
const [updatedRows] = await Book.update(
  { price: sequelize.literal('price * 1.1') },
  { 
    where: {
      price: { [Op.lt]: 30.00 }
    }
  }
);

console.log(`Updated prices for ${updatedRows} books`);