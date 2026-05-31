# Source: https://betterstack.com/community/guides/scaling-nodejs/sequelize-orm/
# Original language: javascript
# Normalized: js
# Block index: 23

[label delete-books.js]
import Book from './models/book.js';
import { sequelize } from './database.js';
import { Op } from 'sequelize';

async function deleteBooks() {
  try {
    // Count books before deletion
    const countBefore = await Book.count();
    console.log(`Total books before deletion: ${countBefore}`);
    
    // Find and delete a book by instance method
    const bookToDelete = await Book.findOne({
      where: {
        author: {
          [Op.like]: '%Casciaro%'  // Find books by Mario Casciaro
        }
      }
    });
    
    if (bookToDelete) {
      console.log(`Found book to delete: ${bookToDelete.title}`);
      
      // Delete the book
      await bookToDelete.destroy();
      console.log('Book deleted successfully');
    }
    
    // Count books after deletion
    const countAfter = await Book.count();
    console.log(`Total books after deletion: ${countAfter}`);
    
  } catch (error) {
    console.error('Error deleting books:', error);
  } finally {
    await sequelize.close();
  }
}

deleteBooks();