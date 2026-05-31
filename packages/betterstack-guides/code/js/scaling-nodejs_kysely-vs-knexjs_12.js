# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-vs-knexjs/
# Original language: javascript
# Normalized: js
# Block index: 12

// Complex join with raw SQL
const stats = await knex.raw(`
  SELECT u.username, COUNT(p.id) as post_count
  FROM users u
  LEFT JOIN posts p ON u.id = p.user_id
  GROUP BY u.username
  HAVING COUNT(p.id) > ?
`, [5]);