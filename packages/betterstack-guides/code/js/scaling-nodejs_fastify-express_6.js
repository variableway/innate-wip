# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 6

...
fastify.addHook('preHandler', async (request, reply) => {
  if (!request.headers['x-auth-token']) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

fastify.get('/data', async () => ({ message: 'Protected content' }));

fastify.listen(3000);
....