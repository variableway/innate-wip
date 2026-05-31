# Source: https://betterstack.com/community/guides/scaling-nodejs/migrating-from-express-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 3

// Fastify with built-in validation
const schema = {
  params: { type: 'object', properties: { id: { type: 'string' } } }
};

fastify.get('/api/data/:id', { schema }, async (request, reply) => {
  const { id } = request.params;
  const result = await fetchData(id);
  return result; // Automatic serialization
});