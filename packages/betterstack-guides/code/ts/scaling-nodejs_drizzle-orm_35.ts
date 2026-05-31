# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 35

// Update all books priced under $30
const batchResult = await db.update(books)
  .set({ price: 29.99, updatedAt: new Date() })
  .where(lt(books.price, 30))
  .run();

console.log(`Updated ${batchResult.changes} books`);