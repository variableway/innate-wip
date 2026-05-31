# Source: https://betterstack.com/community/guides/scaling-nodejs/mikro-orm/
# Original language: typescript
# Normalized: ts
# Block index: 17

// Order books by price (cheapest first)
const orderedBooks = await bookRepository.findAll({
  orderBy: { price: "ASC" },
});
console.log("\n==== Books Ordered by Price (Ascending) ====");
orderedBooks.forEach((book) => {
  console.log(`${book.title}: $${book.price}`);
});