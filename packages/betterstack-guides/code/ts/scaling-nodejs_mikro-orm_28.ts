# Source: https://betterstack.com/community/guides/scaling-nodejs/mikro-orm/
# Original language: typescript
# Normalized: ts
# Block index: 28

// Delete a book by ID
const bookId = 2;
const deleted = await bookRepository.nativeDelete({ id: bookId });

console.log(`Deleted ${deleted} book(s)`);