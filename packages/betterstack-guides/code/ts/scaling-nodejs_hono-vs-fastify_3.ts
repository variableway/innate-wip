# Source: https://betterstack.com/community/guides/scaling-nodejs/hono-vs-fastify/
# Original language: typescript
# Normalized: ts
# Block index: 3

import { Hono } from 'hono';
import { cache } from 'hono/cache';

const app = new Hono();

app.use('*', cache({ cacheName: 'api-cache' }));

app.get('/users/:id', async (c) => {
  const userId = c.req.param('id');
  const user = await getUserById(userId);
  return c.json(user);
});