# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 20

// Insert a single book
const result = await db.insert(books).values({
  title: "JavaScript: The Good Parts",
  author: "Douglas Crockford",
  price: 29.99,
  createdAt: new Date(),
  updatedAt: new Date()
}).run();