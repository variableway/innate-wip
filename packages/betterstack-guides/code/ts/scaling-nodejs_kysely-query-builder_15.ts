# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-query-builder/
# Original language: typescript
# Normalized: ts
# Block index: 15

// Find books in a price range
console.log("\n=== Affordable Books (Under $30) ===");
const affordableBooks = await db
  .selectFrom('books')
  .selectAll()
  .where('price', '<', 30)
  .orderBy('price', 'asc')
  .execute();

console.log(affordableBooks);