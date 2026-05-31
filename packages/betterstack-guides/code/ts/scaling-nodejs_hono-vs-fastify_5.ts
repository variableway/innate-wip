# Source: https://betterstack.com/community/guides/scaling-nodejs/hono-vs-fastify/
# Original language: typescript
# Normalized: ts
# Block index: 5

import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const app = new Hono();

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
});

app.post('/users', zValidator('json', userSchema), async (c) => {
  const userData = c.req.valid('json'); // Fully typed
  const user = await createUser(userData);
  return c.json(user, 201);
});