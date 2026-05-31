# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 11

[label src/db/schema/books.ts]
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Define the books table schema
export const books = sqliteTable('books', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  author: text('author').notNull(),
  price: real('price'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(new Date())
});

// Create a type for book records based on the schema
export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;