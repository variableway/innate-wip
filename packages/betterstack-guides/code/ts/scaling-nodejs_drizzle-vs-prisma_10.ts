# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 10

// Creating with relationships
const user = await prisma.user.create({
  data: {
    email: 'alice@example.com',
    posts: {
      create: [{ title: 'Hello World' }]
    },
    profile: {
      create: { bio: 'TypeScript dev' }
    }
  }
});

// Querying with relationship filters
const users = await prisma.user.findMany({
  where: {
    posts: {
      some: { published: true }
    }
  }
});