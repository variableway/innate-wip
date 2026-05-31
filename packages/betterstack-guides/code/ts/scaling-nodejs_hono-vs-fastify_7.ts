# Source: https://betterstack.com/community/guides/scaling-nodejs/hono-vs-fastify/
# Original language: typescript
# Normalized: ts
# Block index: 7

import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { logger } from 'hono/logger';

const app = new Hono();

app.use('*', logger());
app.use('/api/*', jwt({ secret: 'secret' }));

// Custom middleware
const userMiddleware = async (c, next) => {
  const user = await getCurrentUser(c);
  c.set('user', user);
  await next();
};

app.use('/users/*', userMiddleware);