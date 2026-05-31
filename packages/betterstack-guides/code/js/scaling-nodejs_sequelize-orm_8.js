# Source: https://betterstack.com/community/guides/scaling-nodejs/sequelize-orm/
# Original language: javascript
# Normalized: js
# Block index: 8

[label add-books.js]
import Book from './models/book.js';
import { sequelize } from './database.js';

async function addBooks() {
  try {
    // Create book objects using the create method
    const books = await Promise.all([
      Book.create({
        title: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        price: 29.99
      }),
      Book.create({
        title: "Eloquent JavaScript",
        author: "Marijn Haverbeke",
        price: 34.95
      }),
      Book.create({
        title: "You Don't Know JS",
        author: "Kyle Simpson",
        price: 24.99
      })
    ]);
    
    // Print the newly created books with their IDs
    books.forEach(book => {
      console.log(`Added: ${book.getDetails()} with ID: ${book.id}`);
    });
    
    // Add another book using build and save
    const fourthBook = Book.build({
      title: "Node.js Design Patterns",
      author: "Mario Casciaro",
      price: 39.99
    });
    
    // Save the book to the database
    await fourthBook.save();
    console.log(`Added: ${fourthBook.getDetails()} with ID: ${fourthBook.id}`);
    
  } catch (error) {
    console.error('Error adding books:', error);
  } finally {
    await sequelize.close();
  }
}

addBooks();