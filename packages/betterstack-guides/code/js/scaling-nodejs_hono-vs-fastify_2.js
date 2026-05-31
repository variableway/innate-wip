# Source: https://betterstack.com/community/guides/scaling-nodejs/hono-vs-fastify/
# Original language: javascript
# Normalized: js
# Block index: 2

// Precompiled JSON serialization
const fastify = Fastify({
  logger: true,
  jsonShorthand: false
});

fastify.get('/users/:id', {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' }
        }
      }
    }
  }
}, async (request, reply) => {
  const user = await getUserById(request.params.id);
  return user;
});