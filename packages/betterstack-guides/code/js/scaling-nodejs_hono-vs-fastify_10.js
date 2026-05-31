# Source: https://betterstack.com/community/guides/scaling-nodejs/hono-vs-fastify/
# Original language: javascript
# Normalized: js
# Block index: 10

const fastify = Fastify({ logger: true });

fastify.get('/health', async () => ({ status: 'healthy' }));

const start = async () => {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
};

start();