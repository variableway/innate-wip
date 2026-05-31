# Source: https://betterstack.com/community/guides/scaling-nodejs/mikro-orm/
# Original language: typescript
# Normalized: ts
# Block index: 20

[label src/update-books.ts]
import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config';
import { Book } from './entities/Book';

async function updateBooks() {
  try {
    // Initialize MikroORM
    const orm = await MikroORM.init(config);

    // Get the EntityManager
    const em = orm.em.fork();

    // Get a reference to the Book repository
    const bookRepository = em.getRepository(Book);

    // Find a book to update
    console.log("=== Before update ===");
    const book = await bookRepository.findOne({ title: 'TypeScript: The Good Parts' });

    if (book) {
      console.log(`${book.title} current price: $${book.price}`);

      // Update the book's price
      book.price = 32.99;

      // Flush changes to the database
      await em.flush();

      console.log("=== After update ===");
      console.log(`${book.title} new price: $${book.price}`);
    }

    // Close the connection
    await orm.close(true);
  } catch (error) {
    console.error('Error updating books:', error);
  }
}

updateBooks();