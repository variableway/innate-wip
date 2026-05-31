# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 27

const allBooks = await db.select().from(books).all();