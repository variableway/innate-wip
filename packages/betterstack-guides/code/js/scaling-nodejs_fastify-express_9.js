# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 9

[label userPlugin.js]
export default async function userPlugin(fastify, options) {
  fastify.decorate('userService', {
    getUser: (id) => ({ id, name: `User ${id}` }),
  });

  fastify.get('/user/:id', async (request, reply) => {
    const user = fastify.userService.getUser(request.params.id);
    reply.send(user);
  });
}