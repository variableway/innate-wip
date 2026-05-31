# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-query-builder/
# Original language: typescript
# Normalized: ts
# Block index: 4

[label src/database.ts]
import { Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';
import { Generated } from "kysely";

// Define our bookstore database schema
interface DB {
  books: {
    id: Generated<number>;
    title: string;
    author: string;
    price: number;
    in_stock: number;
  }
}

// Initialize the database connection
const db = new Kysely<DB>({
  dialect: new SqliteDialect({
    database: new Database('bookstore.db')
  })
});

export default db;