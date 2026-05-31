# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-fastify/
# Original language: javascript
# Normalized: js
# Block index: 7

[label server.js]
const createPostSchema = {
  type: 'object',
  required: ['title', 'content'],
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 100 },
    content: { type: 'string', minLength: 1 }
  },
  additionalProperties: false
};

fastify.post('/posts', {
  schema: { body: createPostSchema, response: { 201: postSchema } }
}, async (request, reply) => {
  const post = { id: Date.now().toString(), ...request.body };
  reply.code(201);
  return post; // Automatically serialized using schema
});