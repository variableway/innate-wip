# Source: https://betterstack.com/community/guides/scaling-nodejs/sequelize-orm/
# Original language: javascript
# Normalized: js
# Block index: 21

// Find the book to update
const book = await Book.findOne({
  where: { title: "Eloquent JavaScript" }
});

// Update multiple attributes at once
book.title = "Eloquent JavaScript: Third Edition";
book.price = 39.99;
book.author = "Marijn Haverbeke (3rd Ed.)";

// Save all changes with a single operation
await book.save();