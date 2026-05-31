# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 5

[label schema.ts]
import { pgTable, serial, text, varchar, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: text('name')
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  published: boolean('published').default(false),
  authorId: serial('author_id').references(() => users.id)
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts)
}));