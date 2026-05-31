# Source: https://betterstack.com/community/guides/scaling-nodejs/hono-vs-fastify/
# Original language: javascript
# Normalized: js
# Block index: 8

// Database plugin
await fastify.register(require('@fastify/postgres'), {
  connectionString: process.env.DATABASE_URL
});

fastify.get('/users', async (request, reply) => {
  const client = await fastify.pg.connect();
  const { rows } = await client.query('SELECT * FROM users');
  client.release();
  return rows;
});