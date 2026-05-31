# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: typescript
# Normalized: ts
# Block index: 19

[label prisma/seed.ts]
import { PrismaClient } from '@prisma/client';
[highlight]
import seedData from './data.json';
[/highlight]

const prisma = new PrismaClient();

async function main() {
  // Delete existing records
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  for (const userData of seedData.users) {
    await prisma.user.create({
      data: userData,
    });
  }

  // Create posts
  for (const postData of seedData.posts) {
    const { authorEmail, ...postInfo } = postData;
    await prisma.post.create({
      data: {
        ...postInfo,
        author: {
          connect: { email: authorEmail },
        },
      },
    });
  }

  // Create comments
  for (const commentData of seedData.comments) {
    const { authorEmail, postTitle, ...commentInfo } = commentData;
    await prisma.comment.create({
      data: {
        ...commentInfo,
        author: {
          connect: { email: authorEmail },
        },
        post: {
          connect: { title: postTitle },
        },
      },
    });
  }

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