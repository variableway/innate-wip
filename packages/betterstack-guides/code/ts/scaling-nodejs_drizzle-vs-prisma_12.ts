# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 12

// Querying with relationships
const userWithPosts = await db.query.users.findFirst({
  with: {
    posts: {
      where: eq(posts.published, true),
      limit: 5
    }
  }
});