# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-vs-knexjs/
# Original language: typescript
# Normalized: ts
# Block index: 6

// Find recent active users
const users = await db
  .selectFrom('users')
  .select(['id', 'username'])
  .where('active', '=', true)
  .orderBy('created_at', 'desc')
  .limit(5)
  .execute();

// Count posts by category
const counts = await db
  .selectFrom('posts')
  .select('category')
  .select(eb => [eb.fn.count('id').as('total')])
  .groupBy('category')
  .execute();