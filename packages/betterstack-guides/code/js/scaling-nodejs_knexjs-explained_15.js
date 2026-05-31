# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 15

[label update-books.js]
import { db } from './database.js';

async function updateBooks() {
  try {
    // Find a book to update
    console.log("=== Before update ===");
    const book = await db('books')
      .where('title', 'JavaScript: The Good Parts')
      .first();
    
    if (book) {
      console.log(`${book.title} current price: $${book.price}`);
      
      // Update the book's price
      await db('books')
        .where('id', book.id)
        .update({
          price: 32.99,
          updated_at: db.fn.now() // Update the timestamp
        });
      
      // Check the new price
      const updated = await db('books')
        .where('id', book.id)
        .first();
      
      console.log("=== After update ===");
      console.log(`${updated.title} new price: $${updated.price}`);
    }
    
    // Close the database connection
    await db.destroy();
  } catch (error) {
    console.error('Error updating books:', error);
    await db.destroy();
  }
}

updateBooks();