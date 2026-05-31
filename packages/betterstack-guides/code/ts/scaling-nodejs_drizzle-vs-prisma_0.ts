# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 0

// Prisma's entity-focused query API
const users = await prisma.user.findMany({
  where: {
    OR: [
      { email: { contains: 'example.com' } },
      { name: { startsWith: 'A' } }
    ],
    posts: { some: { published: true } }
  },
  select: {
    id: true,
    email: true,
    _count: { select: { posts: true } }
  },
  take: 10
});