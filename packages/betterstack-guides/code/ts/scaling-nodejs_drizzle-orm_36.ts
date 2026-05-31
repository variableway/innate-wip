# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 36

import { sql } from 'drizzle-orm';

// Increase all prices by 10%
const priceUpdateResult = await db.update(books)
  .set({
    price: sql`${books.price} * 1.1`,
    updatedAt: new Date()
  })
  .run();