# Source: https://betterstack.com/community/guides/scaling-nodejs/mikro-orm/
# Original language: typescript
# Normalized: ts
# Block index: 13

[label src/query-books.ts]
import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config';
import { Book } from './entities/Book';

async function queryBooks() {
  try {
    // Initialize MikroORM
    const orm = await MikroORM.init(config);

    // Get the EntityManager
    const em = orm.em.fork();

    // Get a reference to the Book repository
    const bookRepository = em.getRepository(Book);

    // Find all books
    console.log("==== All Books ====");
    const allBooks = await bookRepository.findAll();
    allBooks.forEach(book => {
      console.log(`${book.title} by ${book.author}, $${book.price}`);
    });

    // Close the connection
    await orm.close(true);
  } catch (error) {
    console.error('Error querying books:', error);
  }
}

queryBooks();