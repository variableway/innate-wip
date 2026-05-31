# Source: https://betterstack.com/community/guides/scaling-nodejs/hono-vs-fastify/
# Original language: javascript
# Normalized: js
# Block index: 6

// Custom plugin
const userPlugin = async (fastify, options) => {
  fastify.decorate('userService', new UserService(options.database));
  
  fastify.get('/users', async (request, reply) => {
    const users = await fastify.userService.getUsers();
    return users;
  });
};

await fastify.register(userPlugin, { database: db });
await fastify.register(require('@fastify/jwt'), { secret: 'secret' });