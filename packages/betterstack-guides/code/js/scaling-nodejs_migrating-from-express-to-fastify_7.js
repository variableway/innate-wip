# Source: https://betterstack.com/community/guides/scaling-nodejs/migrating-from-express-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 7

// Fastify with built-in schema validation
const schema = {
  params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } } },
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 50 },
      email: { type: 'string', format: 'email' }
    },
    required: ['name', 'email']
  }
};

fastify.post('/users/:id', { schema }, async (request, reply) => {
  // All validation happens automatically before this handler runs
  const { id } = request.params;
  const userData = request.body;
  
  const updatedUser = await updateUser(id, userData);
  return updatedUser;
});