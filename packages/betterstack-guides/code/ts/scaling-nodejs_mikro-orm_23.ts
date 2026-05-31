# Source: https://betterstack.com/community/guides/scaling-nodejs/mikro-orm/
# Original language: typescript
# Normalized: ts
# Block index: 23

// Find the book to update
const book = await bookRepository.findOne({ title: "Eloquent TypeScript" });

if (book) {
  // Update multiple attributes
  book.title = "Eloquent TypeScript: Third Edition";
  book.price = 39.99;
  book.author = "Marijn Haverbeke (3rd Ed.)";

  // Flush all changes at once
  await em.flush();

  console.log(`Updated: ${book.getDetails()}`);
}