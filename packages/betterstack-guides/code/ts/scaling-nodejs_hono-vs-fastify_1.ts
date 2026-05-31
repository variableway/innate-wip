# Source: https://betterstack.com/community/guides/scaling-nodejs/hono-vs-fastify/
# Original language: typescript
# Normalized: ts
# Block index: 1

import { Hono } from 'hono';

const app = new Hono();

app.post('/users', async (c) => {
  const userData = await c.req.json();
  const user = await createUser(userData);
  return c.json(user, 201);
});

// Works on Node.js, Deno, Bun, Cloudflare Workers
export default app;