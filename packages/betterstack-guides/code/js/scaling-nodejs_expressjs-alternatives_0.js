# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 0

// Install: npm install fastify
const fastify = require('fastify')({ logger: true });

// Define a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

// POST example with JSON schema validation
fastify.post('/user', {
  schema: {
    body: {
      type: 'object',
      required: ['username', 'email'],
      properties: {
        username: { type: 'string' },
        email: { type: 'string', format: 'email' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' }
        }
      }
    }
  }
}, async (request, reply) => {
  // The request body is automatically validated!
  const { username, email } = request.body;

  // Process user registration...

  return { success: true };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();