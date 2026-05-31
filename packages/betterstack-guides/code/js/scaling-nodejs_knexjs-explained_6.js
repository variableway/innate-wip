# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 6

[label add-books.js]
import { db } from './database.js';

async function addBooks() {
  try {
    // Insert a single book
    const firstId = await db('books').insert({
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      price: 29.99,
      stock: 10
    });
    
    console.log(`Added book with ID: ${firstId}`);
    
    // Insert multiple books at once using an array
    await db('books').insert([
      {
        title: "Eloquent JavaScript",
        author: "Marijn Haverbeke",
        price: 34.95,
        stock: 8
      },
      {
        title: "You Don't Know JS",
        author: "Kyle Simpson",
        price: 24.99,
        stock: 15
      }
    ]);
    
    // Display all books
    const books = await db('books').select('*');
    books.forEach(book => {
      console.log(`${book.title} by ${book.author} - $${book.price}`);
    });
    
  } catch (error) {
    console.error('Error adding books:', error);
  } finally {
    await db.destroy();
  }
}

addBooks();