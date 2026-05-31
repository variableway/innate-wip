# Source: https://betterstack.com/community/guides/scaling-nodejs/full-text-search-in-postgres-with-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 5

[label src/db/schema.ts]
import { pgTable, serial, timestamp, text } from 'drizzle-orm/pg-core';

export const articlesTable = pgTable('articles', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    body: text('body'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    // We'll add our search-optimized column here soon!
});