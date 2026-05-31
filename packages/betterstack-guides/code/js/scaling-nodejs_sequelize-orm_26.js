# Source: https://betterstack.com/community/guides/scaling-nodejs/sequelize-orm/
# Original language: javascript
# Normalized: js
# Block index: 26

// Delete a book by ID
const bookId = 2;  // ID of the book to delete
const deleted = await Book.destroy({
  where: { id: bookId }
});

console.log(`Deleted ${deleted} book(s)`);