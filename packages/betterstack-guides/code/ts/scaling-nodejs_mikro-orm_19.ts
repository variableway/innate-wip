# Source: https://betterstack.com/community/guides/scaling-nodejs/mikro-orm/
# Original language: typescript
# Normalized: ts
# Block index: 19

// Get a book by its ID
const bookById = await bookRepository.findOne(2);
console.log("\n==== Book by ID ====");
if (bookById) {
  console.log(`Found by ID: ${bookById.getDetails()}`);
}