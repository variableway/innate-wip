# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-query-builder/
# Original language: typescript
# Normalized: ts
# Block index: 11

[label src/query-books.ts]
import db from './database';

async function queryBooks() {
  // Get all books
  console.log("\n=== All Books ===");
  const allBooks = await db
    .selectFrom('books')
    .selectAll()
    .execute();
  
  console.log(allBooks);
  
  await db.destroy();
}

queryBooks();