# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 21

// Insert with returning
const inserted = await db.insert(books)
  .values({
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    price: 34.95,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  .returning()
  .get();

console.log(`Added: ${inserted.title} with ID: ${inserted.id}`);