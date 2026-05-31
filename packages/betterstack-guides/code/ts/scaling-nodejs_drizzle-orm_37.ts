# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 37

[label src/delete-books.ts]
import { db } from './db/index.js';
import { books } from './db/schema/books.js';
import { eq, sql } from 'drizzle-orm';

async function deleteBooks() {
  try {
    // First, count total books before deletion
    const beforeCount = await db.select({ count: sql`count(*)` })
      .from(books)
      .get();
    
    console.log(`Books before deletion: ${beforeCount?.count ?? 0}`);

    // Delete a specific book by title
    const result = await db.delete(books)
      .where(eq(books.title, "SQL Database Design"))
      .run();
    
    console.log(`Deleted ${result.changes} book(s)`);
    
    // Count books after deletion to verify
    const afterCount = await db.select({ count: sql`count(*)` })
      .from(books)
      .get();
    
    console.log(`Books after deletion: ${afterCount?.count ?? 0}`);
  } catch (error) {
    console.error('Error deleting books:', error);
  }
}

deleteBooks();