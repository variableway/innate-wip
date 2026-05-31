# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 20

// Prisma generates these types for you
import { User, Prisma } from '@prisma/client';

// Fully typed operations
const getUser = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id }
  });
};

// Input types are also generated
const createUser = async (data: Prisma.UserCreateInput): Promise<User> => {
  return prisma.user.create({ data });
};

// Complex queries stay type-safe
const result = await prisma.user.findUnique({
  where: { id },
  include: { posts: true }
});
// TypeScript knows result has a posts array