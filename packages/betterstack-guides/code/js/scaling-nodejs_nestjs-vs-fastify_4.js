# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-fastify/
# Original language: javascript
# Normalized: js
# Block index: 4

[label server.js]
const fastify = require('fastify')({ logger: true });

const postSchema = {
  type: 'object',
  required: ['title', 'content'],
  properties: {
    title: { type: 'string', minLength: 1 },
    content: { type: 'string', minLength: 1 }
  }
};

let posts = [{ id: '1', title: 'First Post', content: 'Hello World' }];

fastify.get('/posts', {
  schema: { response: { 200: { type: 'array', items: postSchema } } }
}, async () => posts);

fastify.post('/posts', {
  schema: { body: postSchema, response: { 201: postSchema } }
}, async (request, reply) => {
  const post = { id: Date.now().toString(), ...request.body };
  posts.push(post);
  reply.code(201);
  return post;
});

fastify.listen({ port: 3000 });