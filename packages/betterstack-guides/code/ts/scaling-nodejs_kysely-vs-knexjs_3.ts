# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-vs-knexjs/
# Original language: typescript
# Normalized: ts
# Block index: 3

// Database schema as TypeScript types
interface Database {
  users: {
    id: number;
    username: string;
    email: string;
  };
  posts: {
    id: number;
    title: string;
    user_id: number;
  };
}

// Connection setup
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({ database: 'my_db' })
  })
});