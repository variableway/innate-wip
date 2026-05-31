# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 30

const bookById = await db.select()
  .from(books)
  .where(eq(books.id, 1))
  .get();