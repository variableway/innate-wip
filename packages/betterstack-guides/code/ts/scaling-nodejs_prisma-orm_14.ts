# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: typescript
# Normalized: ts
# Block index: 14

[label prisma/seed.ts]
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete all existing records
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      password: 'password123', // Use proper hashing in production!
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      password: 'password456', // Use proper hashing in production!
    },
  });

  // Create posts with author
  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with Prisma',
      content: 'This is a post about Prisma ORM and how to use it effectively with PostgreSQL...',
      published: true,
      author: {
        connect: { id: alice.id },
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Advanced PostgreSQL Features',
      content: 'In this post, we explore some advanced PostgreSQL features and how they integrate with Prisma...',
      published: true,
      author: {
        connect: { id: bob.id },
      },
    },
  });

  // Create comments
  await prisma.comment.create({
    data: {
      content: 'Great post! I learned a lot.',
      author: {
        connect: { id: bob.id },
      },
      post: {
        connect: { id: post1.id },
      },
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Thanks for sharing this information!',
      author: {
        connect: { id: alice.id },
      },
      post: {
        connect: { id: post2.id },
      },
    },
  });

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });