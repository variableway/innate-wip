# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-file-uploads/
# Original language: javascript
# Normalized: js
# Block index: 3

[label server.js]
import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.get('/', async (request, reply) => {
  return { message: 'Fastify File Upload Service is ready' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Fastify file upload server running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();