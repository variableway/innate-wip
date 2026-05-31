# Source: https://betterstack.com/community/guides/scaling-nodejs/mikro-orm/
# Original language: typescript
# Normalized: ts
# Block index: 29

// Bulk delete - remove inexpensive books
const deletedCount = await bookRepository.nativeDelete({
  price: { $lt: 30.0 },
});

console.log(`Deleted ${deletedCount} inexpensive books`);