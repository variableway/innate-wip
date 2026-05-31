# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 41

// Delete a book by ID
const deleteById = await db.delete(books)
  .where(eq(books.id, 1))
  .run();