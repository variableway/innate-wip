# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 13

import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

const userSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email()
});

const appRouter = t.router({
  createUser: t.procedure
    .input(userSchema)
    .mutation(async ({ input }) => {
      const user = input;
      return { id: 'new-user-id', ...user };
    }),
});

export type AppRouter = typeof appRouter;