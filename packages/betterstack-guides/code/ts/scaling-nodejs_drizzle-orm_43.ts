# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 43

// CAUTION: This will delete ALL books
const deleteAll = await db.delete(books).run();