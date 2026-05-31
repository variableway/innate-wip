# Source: https://betterstack.com/community/guides/scaling-nodejs/hono-vs-fastify/
# Original language: typescript
# Normalized: ts
# Block index: 9

import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const app = new Hono();
const sql = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql);

app.get('/users', async (c) => {
  const users = await db.select().from(usersTable);
  return c.json(users);
});