# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-query-builder/
# Original language: typescript
# Normalized: ts
# Block index: 19

// Apply a 10% discount to books over $30
console.log("\n=== Applying Discount to Expensive Books ===");

const discountResult = await db
  .updateTable('books')
  .set({
    price: db.fn.val(db.ref('price').multiply(0.9)) // apply 10% discount
  })
  .where('price', '>', 30)
  .execute();

console.log(`Applied discount to ${discountResult.numUpdatedRows} books`);