# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 31

[label src/update-books.ts]
import { db } from './db/index';
import { books } from './db/schema/books';
import { eq } from 'drizzle-orm';

async function updateBooks() {
  try {
    // Find a book to update
    const book = await db
      .select()
      .from(books)
      .where(eq(books.title, 'TypeScript Programming'))
      .get();

    // Update the book's price
    const result = await db
      .update(books)
      .set({
        price: 36.99,
        updatedAt: new Date(),
      })
      .where(eq(books.id, book.id))
      .run();

    // Verify the update
    const updatedBook = await db
      .select()
      .from(books)
      .where(eq(books.id, book.id))
      .get();

    if (updatedBook) {
      console.log(`After: ${updatedBook.title} - $${updatedBook.price}`);
      console.log(`Updated ${result.changes} book(s)`);
    } else {
      console.log('Update ran, but no book was found afterward.');
    }
  } catch (error) {
    console.error('Error updating books:', error);
  }
}

updateBooks();