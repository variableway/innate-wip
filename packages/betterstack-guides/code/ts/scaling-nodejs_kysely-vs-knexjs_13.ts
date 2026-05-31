# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-vs-knexjs/
# Original language: typescript
# Normalized: ts
# Block index: 13

// Complex join with type-safe raw SQL
const stats = await db
  .selectFrom(
    sql<{ username: string, post_count: number }>`
      SELECT u.username, COUNT(p.id) as post_count
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id
      GROUP BY u.username
      HAVING COUNT(p.id) > ${5}
    `.as('stats')
  )
  .selectAll()
  .execute();