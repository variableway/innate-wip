# Source: https://betterstack.com/community/guides/scaling-nodejs/mikro-orm/
# Original language: typescript
# Normalized: ts
# Block index: 10

[label src/add-books.ts]
import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config';
import { Book } from './entities/Book';

async function addBooks() {
  try {
    // Initialize MikroORM
    const orm = await MikroORM.init(config);

    // Get the EntityManager
    const em = orm.em.fork();

    // Create book entities
    const book1 = em.create(Book, {
      title: 'TypeScript: The Good Parts',
      author: 'Douglas Crockford',
      price: 29.99
    });

    const book2 = em.create(Book, {
      title: 'Eloquent TypeScript',
      author: 'Marijn Haverbeke',
      price: 34.95
    });

    const book3 = em.create(Book, {
      title: 'You Don\'t Know TypeScript',
      author: 'Kyle Simpson',
      price: 24.99
    });

    // Persist entities to the database
    await em.persistAndFlush([book1, book2, book3]);

    // Print the newly created books with their IDs
    console.log(`Added: ${book1.getDetails()} with ID: ${book1.id}`);
    console.log(`Added: ${book2.getDetails()} with ID: ${book2.id}`);
    console.log(`Added: ${book3.getDetails()} with ID: ${book3.id}`);

    // Create a book using a different approach
    const book4 = new Book();
    book4.title = 'Node.js and TypeScript Design Patterns';
    book4.author = 'Mario Casciaro';
    book4.price = 39.99;

    // Add to EntityManager and persist
    em.persist(book4);
    await em.flush();

    console.log(`Added: ${book4.getDetails()} with ID: ${book4.id}`);

    // Close the connection
    await orm.close(true);
  } catch (error) {
    console.error('Error adding books:', error);
  }
}

addBooks();