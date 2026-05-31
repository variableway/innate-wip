# Source: https://betterstack.com/community/guides/scaling-nodejs/trpc-explained/
# Original language: typescript
# Normalized: ts
# Block index: 21

[label src/trpc/router.ts]
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

// Mock database
let users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

// Initialize tRPC
const t = initTRPC.create();

// Define input validation schemas with Zod
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email format'),
});

[highlight]
// Define a schema for user ID
const userIdSchema = z.object({
  id: z.string(),
});
[/highlight]

export const appRouter = t.router({
  // Create a new user
  createUser: t.procedure
    .input(userSchema)
    ....
    }),

  [highlight]
  // Get all users
  getUsers: t.procedure
    .query(() => {
      console.log('Getting all users');
      return users;
    }),
  
  // Get a single user by ID
  getUserById: t.procedure
    .input(userIdSchema)
    .query(({ input }) => {
      console.log(`Getting user with ID: ${input.id}`);
      
      const user = users.find(user => user.id === input.id);
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `User with ID ${input.id} not found`,
        });
      }
      
      return user;
    }),
  [/highlight]
});

// Export type definition of API
export type AppRouter = typeof appRouter;