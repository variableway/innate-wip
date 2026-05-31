# Source: https://betterstack.com/community/guides/scaling-nodejs/hono-vs-fastify/
# Original language: javascript
# Normalized: js
# Block index: 0

import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

// Schema-based validation
fastify.post('/users', {
  schema: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' }
      }
    }
  }
}, async (request, reply) => {
  const user = await createUser(request.body);
  return reply.code(201).send(user);
});