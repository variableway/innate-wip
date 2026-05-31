# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-vs-knexjs/
# Original language: javascript
# Normalized: js
# Block index: 4

// Find recent active users
const users = await knex('users')
  .select('id', 'username')
  .where('active', true)
  .orderBy('created_at', 'desc')
  .limit(5);

// Count posts by category
const counts = await knex('posts')
  .select('category')
  .count('id as total')
  .groupBy('category');