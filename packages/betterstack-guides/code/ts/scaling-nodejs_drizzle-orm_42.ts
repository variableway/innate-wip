# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 42

// Delete all inexpensive books
const batchDelete = await db.delete(books)
  .where(lt(books.price, 30))
  .run();

console.log(`Deleted ${batchDelete.changes} inexpensive books`);