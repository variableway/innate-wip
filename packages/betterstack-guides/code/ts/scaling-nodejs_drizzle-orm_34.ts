# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 34

const result = await db.update(table)
  .set({ column1: newValue1, column2: newValue2 })
  .where(condition)
  .run();