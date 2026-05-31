# Source: https://betterstack.com/community/guides/scaling-nodejs/migrating-from-express-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 15

// Optimized response serialization with schemas
const userResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' }
  }
};

fastify.get('/users/:id', {
  schema: { response: { 200: userResponseSchema } }
}, async (request, reply) => {
  const user = await getUserWithProfile(request.params.id);
  return user; // Fastify optimizes serialization based on schema
});