# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 29

const orderedBooks = await db.select()
  .from(books)
  .orderBy(desc(books.price))
  .all();