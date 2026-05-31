# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/
# Original language: javascript
# Normalized: js
# Block index: 23

[label app.js]
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { testConnection } from './utils/db.js';
[highlight]
import postRoutes from './routes/posts.js';
[/highlight]

...
// Register plugins
fastify.register(cors);

[highlight]
// Register route plugins
fastify.register(postRoutes, { prefix: '/api/posts' });
[/highlight]

// Root route
fastify.get('/', async (request, reply) => {
  return { message: 'Welcome to the Blog API' };
});

// Start server
const start = async () => {
  ...
};

start();