# Source: https://betterstack.com/community/guides/scaling-nodejs/full-text-search-in-postgres-with-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 13

[label src/db/schema.ts]
[highlight]
import { pgTable, serial, timestamp, text, index, customType } from 'drizzle-orm/pg-core';
import { SQL, sql } from 'drizzle-orm';

// Custom tsvector type for Drizzle
export const tsvector = customType<{
  data: string;
}>({
  dataType() {
    return 'tsvector';
  },
});
[/highlight]

export const articlesTable = pgTable('articles', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    body: text('body'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
[highlight]
    // Search vector combining title and body with different weights
    searchVector: tsvector('search_vector')
      .notNull()
      .generatedAlwaysAs((): SQL => 
        sql`setweight(to_tsvector('english', ${articlesTable.title}), 'A') || 
            setweight(to_tsvector('english', coalesce(${articlesTable.body}, '')), 'B')`
      ),
}, (table) => [
  // GIN index for fast full-text search
  index('articles_search_idx').using('gin', table.searchVector),
]);
[/highlight]