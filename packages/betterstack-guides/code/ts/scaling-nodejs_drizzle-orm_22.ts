# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 22

// Insert books in batches of 50
const largeDataset: NewBook[] = [/* hundreds of book objects */];
const batchSize = 50;

for (let i = 0; i < largeDataset.length; i += batchSize) {
  const batch = largeDataset.slice(i, i + batchSize);
  await db.insert(books).values(batch).run();
  console.log(`Inserted batch ${i / batchSize + 1}`);
}