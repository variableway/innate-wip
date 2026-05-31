# Source: https://betterstack.com/community/guides/scaling-nodejs/mikro-orm/
# Original language: typescript
# Normalized: ts
# Block index: 18

// Get a specific book
const specificBook = await bookRepository.findOne({
  title: "Eloquent TypeScript",
});
console.log("\n==== Specific Book ====");
if (specificBook) {
  console.log(`Found: ${specificBook.getDetails()}`);
}