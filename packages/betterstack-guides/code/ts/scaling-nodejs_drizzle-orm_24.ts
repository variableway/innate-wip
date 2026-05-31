# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 24

[label src/query-books.ts]
import { db } from './db/index';
import { books, type Book } from './db/schema/books';

async function queryBooks() {
  try {
    // Get all books
    console.log("==== All Books ====");
    const allBooks = await db.select().from(books).all();
    
    allBooks.forEach((book: Book) => {
      console.log(`${book.title} by ${book.author}, $${book.price}`);
    });
    
  } catch (error) {
    console.error('Error querying books:', error);
  }
}

queryBooks();