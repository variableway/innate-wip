# Source: https://betterstack.com/community/guides/scaling-nodejs/sequelize-orm/
# Original language: javascript
# Normalized: js
# Block index: 10

[label query-books.js]
import Book from './models/book.js';
import { sequelize } from './database.js';
import { Op } from 'sequelize';

async function queryBooks() {
  try {
    // Get all books
    console.log("==== All Books ====");
    const allBooks = await Book.findAll();
    allBooks.forEach(book => {
      console.log(`${book.title} by ${book.author}, $${book.price}`);
    });
    
    // Close the database connection
    await sequelize.close();
  } catch (error) {
    console.error('Error querying books:', error);
    await sequelize.close();
  }
}

queryBooks();