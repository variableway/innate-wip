# Source: https://betterstack.com/community/guides/scaling-nodejs/mikro-orm/
# Original language: typescript
# Normalized: ts
# Block index: 24

// Bulk update - increase prices of all books under $30 by 10%
const result = await bookRepository.nativeUpdate(
  { price: { $lt: 30.0 } },
  { $inc: { price: { $mul: 0.1 } } }
);

console.log(`Updated prices for ${result} books`);