# Source: https://betterstack.com/community/guides/scaling-nodejs/mikro-orm/
# Original language: typescript
# Normalized: ts
# Block index: 16

// Find books by a specific author
const crockfordBooks = await bookRepository.find({
  author: "Douglas Crockford",
});
console.log("\n==== Books by Douglas Crockford ====");
crockfordBooks.forEach((book) => {
  console.log(`${book.title}, $${book.price}`);
});

// Find books with price less than $30
const affordableBooks = await bookRepository.find({ price: { $lt: 30.0 } });
console.log("\n==== Affordable Books (under $30) ====");
affordableBooks.forEach((book) => {
  console.log(`${book.title} by ${book.author}, $${book.price}`);
});