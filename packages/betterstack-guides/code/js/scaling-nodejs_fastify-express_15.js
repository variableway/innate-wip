# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 15

...
fastify.addSchema({
  $id: 'userSchema',
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    age: { type: 'number', minimum: 18 },
  },
});

fastify.post('/user', {
  schema: {
    body: { $ref: 'userSchema#' },
  },
}, (request, reply) => {
  reply.send({ message: 'Validation passed!', data: request.body });
});
...