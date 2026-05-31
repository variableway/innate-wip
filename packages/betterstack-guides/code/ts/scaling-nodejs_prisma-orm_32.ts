# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: typescript
# Normalized: ts
# Block index: 32

// In a file like src/utils/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
 prisma: PrismaClient | undefined;
};

export const prisma =
 globalForPrisma.prisma ??
 new PrismaClient({
   log: ['query', 'info', 'warn', 'error'],
 });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;