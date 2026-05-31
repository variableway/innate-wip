# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-fastify/
# Original language: javascript
# Normalized: js
# Block index: 12

[label server.js]
// Automatic JSON serialization optimization
const responseSchema = {
  type: 'object',
  properties: { id: { type: 'string' }, title: { type: 'string' } }
};

fastify.get('/posts/:id', {
  schema: { response: { 200: responseSchema } }
}, async (request, reply) => {
  const post = await findPost(request.params.id);
  return { id: post.id, title: post.title };
});