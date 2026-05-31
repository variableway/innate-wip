# Source: https://betterstack.com/community/guides/scaling-nodejs/sequelize-orm/
# Original language: javascript
# Normalized: js
# Block index: 18

[label update-books.js]
import Book from './models/book.js';
import { sequelize } from './database.js';
import { Op } from 'sequelize';

async function updateBooks() {
  try {
    // Find a book to update
    console.log("=== Before update ===");
    const book = await Book.findOne({
      where: {
        title: "JavaScript: The Good Parts"
      }
    });
    
    if (book) {
      console.log(`${book.title} current price: $${book.price}`);
      
      // Update the book's price
      book.price = 32.99;
      
      // Save the changes
      await book.save();
      
      console.log("=== After update ===");
      console.log(`${book.title} new price: $${book.price}`);
    }
    
    // Close the database connection
    await sequelize.close();
  } catch (error) {
    console.error('Error updating books:', error);
    await sequelize.close();
  }
}

updateBooks();