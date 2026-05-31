# Source: https://betterstack.com/community/guides/scaling-nodejs/migrating-from-express-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 1

// Fastify with schema-driven approach
const schema = {
  params: { type: 'object', properties: { id: { type: 'string' } } }
};

fastify.get('/data/:id', { schema }, async (request, reply) => {
  const result = await fetchUserData(request.params.id);
  return result; // Automatic validation and serialization
});