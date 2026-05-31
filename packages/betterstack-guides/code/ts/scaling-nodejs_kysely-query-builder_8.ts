# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-query-builder/
# Original language: typescript
# Normalized: ts
# Block index: 8

[label src/add-books.ts]
import db from './database';

async function addBooks() {
  await db
    .insertInto('books')
    .values([
      {
        title: 'SQL Database Design',
        author: 'Michael Johnson',
        price: 34.99,
        in_stock: 1
      },
      {
        title: 'Node.js Masterclass',
        author: 'David Wilson',
        price: 24.99,
        in_stock: 1
      }
    ])
    .execute();

  console.log('Books added successfully');
  await db.destroy();
}

addBooks();