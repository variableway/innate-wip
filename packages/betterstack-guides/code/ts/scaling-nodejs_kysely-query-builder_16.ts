# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-query-builder/
# Original language: typescript
# Normalized: ts
# Block index: 16

[label src/update-books.ts]
import db from './database';

async function updateBooks() {
  // Update the price of a specific book
  console.log("=== Updating Book Price ===");

  const updateResult = await db
    .updateTable('books')
    .set({ price: 39.99 })
    .where('title', '=', 'SQL Database Design')
    .executeTakeFirstOrThrow();

  console.log(`Updated ${updateResult.numUpdatedRows} book`);

  // View updated records
  console.log("\n=== Books After Updates ===");

  const books = await db
    .selectFrom('books')
    .selectAll()
    .orderBy('price', 'desc')
    .execute();

  console.log(books);

  await db.destroy();
}

updateBooks();