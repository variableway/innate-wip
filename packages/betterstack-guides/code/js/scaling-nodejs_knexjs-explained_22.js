# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 22

[label delete-books.js]
import { db } from './database.js';

async function deleteBooks() {
  try {
    // Count books before deletion
    const countBefore = await db('books').count('* as count').first();
    console.log(`Total books before deletion: ${countBefore.count}`);
    
    // Find a book to delete
    const bookToDelete = await db('books')
      .where('author', 'like', '%Crockford%')
      .first();
    
    if (bookToDelete) {
      console.log(`Found book to delete: ${bookToDelete.title}`);
      
      // Delete the book by ID
      await db('books')
        .where('id', bookToDelete.id)
        .del();
      
      console.log('Book deleted successfully');
    }
    
    // Count books after deletion
    const countAfter = await db('books').count('* as count').first();
    console.log(`Total books after deletion: ${countAfter.count}`);
    
    // Close the database connection
    await db.destroy();
  } catch (error) {
    console.error('Error deleting books:', error);
    await db.destroy();
  }
}

deleteBooks();