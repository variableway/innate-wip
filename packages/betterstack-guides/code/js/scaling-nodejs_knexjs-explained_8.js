# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 8

[label query-books.js]
import { db } from './database.js';

async function queryBooks() {
  try {
    // Get all books
    console.log("==== All Books ====");
    const allBooks = await db('books').select('*');
    allBooks.forEach(book => {
      console.log(`${book.title} by ${book.author} - $${book.price}`);
    });
    
    // Close the database connection when done
    await db.destroy();
  } catch (error) {
    console.error('Error querying books:', error);
    await db.destroy();
  }
}

queryBooks();