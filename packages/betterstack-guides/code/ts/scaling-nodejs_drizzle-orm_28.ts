# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 28

const authorBooks = await db.select()
  .from(books)
  .where(eq(books.author, "Boris Cherny"))
  .all();