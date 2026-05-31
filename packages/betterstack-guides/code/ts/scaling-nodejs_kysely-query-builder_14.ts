# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-query-builder/
# Original language: typescript
# Normalized: ts
# Block index: 14

// Find books by a specific author
console.log("\n=== Books by David Wilson ===");
const authorBooks = await db
  .selectFrom('books')
  .selectAll()
  .where('author', '=', 'David Wilson')
  .execute();

console.log(authorBooks);