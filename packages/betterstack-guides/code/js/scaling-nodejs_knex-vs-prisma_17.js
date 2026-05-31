# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: javascript
# Normalized: js
# Block index: 17

// Simple raw query
const users = await knex.raw('SELECT * FROM users WHERE email = ?', 
                           ['alice@example.com']);

// Mix raw expressions with the query builder
const activeUsers = await knex('users')
  .select(knex.raw('COUNT(*) as user_count'))
  .whereRaw('last_login > now() - interval ?', ['7 days']);

// Named parameters
const posts = await knex.raw(`
  SELECT p.*, u.name as author_name
  FROM posts p JOIN users u ON p.author_id = u.id
  WHERE p.published = :published LIMIT :limit
`, { published: true, limit: 10 });