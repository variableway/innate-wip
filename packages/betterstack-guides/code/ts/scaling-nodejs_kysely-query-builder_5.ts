# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-query-builder/
# Original language: typescript
# Normalized: ts
# Block index: 5

[label src/init.ts]
import db from './database';

async function main() {
  // Create books table
  await db.schema
    .createTable('books')
    .ifNotExists()
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('title', 'text', col => col.notNull())
    .addColumn('author', 'text', col => col.notNull())
    .addColumn('price', 'real', col => col.notNull())
    .addColumn('in_stock', 'boolean', col => col.notNull().defaultTo(true))
    .execute();
  
  console.log('Books table created successfully');
}

main()
  .catch(error => console.error(error))
  .finally(async () => await db.destroy());