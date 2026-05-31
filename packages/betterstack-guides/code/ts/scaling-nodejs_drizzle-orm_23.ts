# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 23

// This would cause a TypeScript error because 'title' is required
const invalidBook: NewBook = {
  // title is missing!
  author: "Unknown Author",
  price: 19.99,
  createdAt: new Date(),
  updatedAt: new Date()
};