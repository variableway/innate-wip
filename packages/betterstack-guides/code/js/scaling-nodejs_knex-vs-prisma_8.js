# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: javascript
# Normalized: js
# Block index: 8

// Basic query
const users = await knex('users')
  .select('id', 'name')
  .where('active', true)
  .orderBy('name');

// Join example
const userPosts = await knex('users')
  .join('posts', 'users.id', 'posts.author_id')
  .select('users.name', 'posts.title')
  .where('posts.published', true);

// Aggregation
const postCounts = await knex('posts')
  .select('author_id')
  .count('* as post_count')
  .groupBy('author_id')
  .having('count(*)', '>', 5);