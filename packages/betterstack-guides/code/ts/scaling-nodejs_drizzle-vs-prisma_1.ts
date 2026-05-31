# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 1

// Drizzle's SQL-inspired query API
const users = await db.select({
  id: users.id,
  email: users.email,
  postCount: sql`count(${posts.id})`.as('post_count')
})
.from(users)
.leftJoin(posts, eq(users.id, posts.authorId))
.where(
  or(
    like(users.email, '%example.com%'),
    like(users.name, 'A%')
  )
)
.groupBy(users.id, users.email)
.having(gt(sql`count(${posts.id})`, 0))
.limit(10);