# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 1

// Global hooks
fastify.addHook('onRequest', async (request, reply) => {
  // Called when a request is received
  // Similar to middleware in Express
});

fastify.addHook('preHandler', async (request, reply) => {
  // Called just before the route handler
  // Good place for authentication
});

fastify.addHook('onResponse', async (request, reply) => {
  // Called after the response has been sent
  // Good for logging
});

// Route-specific hooks
fastify.get('/protected', {
  preHandler: async (request, reply) => {
    // This hook only applies to this route
    if (!request.headers.authorization) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  }
}, async (request, reply) => {
  return { data: 'protected content' };
});