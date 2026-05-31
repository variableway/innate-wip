# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 7

// Using the generated client
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create a user with posts in one operation
const user = await prisma.user.create({
  data: {
    email: 'alice@example.com',
    name: 'Alice',
    posts: {
      create: [{ title: 'Hello World' }]
    }
  },
  include: { posts: true }
});