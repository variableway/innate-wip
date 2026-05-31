# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 9

// Basic query
const users = await prisma.user.findMany({
  select: { id: true, name: true },
  where: { active: true },
  orderBy: { name: 'asc' }
});

// Relation query (join)
const userPosts = await prisma.post.findMany({
  where: { published: true },
  select: {
    title: true,
    author: { select: { name: true } }
  }
});

// Aggregation
const postCounts = await prisma.post.groupBy({
  by: ['authorId'],
  _count: { _all: true },
  having: { _count: { _all: { gt: 5 } } }
});