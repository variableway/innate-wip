# Source: https://betterstack.com/community/guides/scaling-nodejs/mikro-orm/
# Original language: typescript
# Normalized: ts
# Block index: 25

[label src/delete-books.ts]
import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config';
import { Book } from './entities/Book';

async function deleteBooks() {
  try {
    // Initialize MikroORM
    const orm = await MikroORM.init(config);

    // Get the EntityManager
    const em = orm.em.fork();

    // Get a reference to the Book repository
    const bookRepository = em.getRepository(Book);

    // Count books before deletion
    const countBefore = await bookRepository.count();
    console.log(`Total books before deletion: ${countBefore}`);

    // Find and delete a book
    const bookToDelete = await bookRepository.findOne({ author: { $like: '%Casciaro%' } });

    if (bookToDelete) {
      console.log(`Found book to delete: ${bookToDelete.title}`);

      // Remove the entity
      await em.removeAndFlush(bookToDelete);
      console.log('Book deleted successfully');
    }

    // Count books after deletion
    const countAfter = await bookRepository.count();
    console.log(`Total books after deletion: ${countAfter}`);

    // Close the connection
    await orm.close(true);
  } catch (error) {
    console.error('Error deleting books:', error);
  }
}

deleteBooks();