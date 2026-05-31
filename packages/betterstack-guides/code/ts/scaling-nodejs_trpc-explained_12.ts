# Source: https://betterstack.com/community/guides/scaling-nodejs/trpc-explained/
# Original language: typescript
# Normalized: ts
# Block index: 12

[label src/index.ts]
import express from 'express';
import cors from 'cors';
[highlight]
import { initTRPC, TRPCError } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
[/highlight]
import { z } from 'zod';

// Mock database - same as before
let users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

[highlight]
// 1. Initialize tRPC
const t = initTRPC.create();
[/highlight]

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email format'),
});

[highlight]
// Create a tRPC router with our procedure
const appRouter = t.router({
  createUser: t.procedure
    .input(userSchema)
    .mutation(({ input }) => {
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

// 4. Export type definition of API
export type AppRouter = typeof appRouter;
[/highlight]

// Create Express app
const app = express();

// Middleware
app.use(cors());

[highlight]
//  Add tRPC middleware to Express
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => ({})
  })
);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
[/highlight]