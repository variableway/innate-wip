# Source: https://betterstack.com/community/guides/scaling-nodejs/trpc-explained/
# Original language: typescript
# Normalized: ts
# Block index: 16

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

// Define input validation schema with Zod
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email format'),
});

// Create a tRPC router with our procedure
export const appRouter = t.router({
  createUser: t.procedure
    .input(userSchema)
    .mutation(({ input }) => {
      console.log('Creating user with input:', input);
      
      // Check for duplicate email
      const existingUser = users.find(user => user.email === input.email);
      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A user with this email already exists',
        });
      }
      
      // Create new user
      const newUser = {
        id: String(users.length + 1),
        name: input.name,
        email: input.email,
      };
      
      // Save to mock database
      users.push(newUser);
      
      // Return the newly created user
      return newUser;
    }),
});

// Export type definition of API
export type AppRouter = typeof appRouter;