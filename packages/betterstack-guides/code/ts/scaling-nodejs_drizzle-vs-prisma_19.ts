# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 19

import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

// Schema definition directly creates TypeScript types
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name')
});

// Types are inferred without generation step
const [user] = await db.select().from(users).where(eq(users.id, 1));

// TypeScript knows user has id, email, and name
console.log(user.email);

// Error: Property 'nonExistent' does not exist on type...
console.log(user.nonExistent);