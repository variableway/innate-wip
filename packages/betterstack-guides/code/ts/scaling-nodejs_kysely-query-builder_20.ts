# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-query-builder/
# Original language: typescript
# Normalized: ts
# Block index: 20

[label src/delete-books.ts]
import db from './database';

async function deleteBooks() {
  // Delete books by a specific author
  console.log("=== Deleting Books by David Wilson ===");

  const deleteResult = await db
    .deleteFrom('books')
    .where('author', '=', 'David Wilson')
    .execute();

  // Check how many books remain to infer how many were deleted
  console.log("\n=== Remaining Books ===");

  const remainingBooks = await db
    .selectFrom('books')
    .selectAll()
    .orderBy('id', 'asc')
    .execute();

  console.log(remainingBooks);

  await db.destroy();
}

deleteBooks();