# Source: https://betterstack.com/community/guides/scaling-nodejs/sequelize-orm/
# Original language: javascript
# Normalized: js
# Block index: 27

// Bulk delete example - delete inexpensive books
const deletedCount = await Book.destroy({
  where: {
    price: {
      [Op.lt]: 30.00
    }
  }
});

console.log(`Deleted ${deletedCount} inexpensive books`);