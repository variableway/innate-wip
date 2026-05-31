# Source: https://betterstack.com/community/guides/scaling-nodejs/migrating-from-express-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 12

// Fastify plugin organization
import fp from 'fastify-plugin';

async function userRoutes(fastify, options) {
  const userService = new UserService(options.database);
  fastify.decorate('userService', userService);
  
  fastify.get('/', async () => fastify.userService.findAll());
  
  fastify.get('/:id', {
    schema: { params: { type: 'object', properties: { id: { type: 'string' } } } }
  }, async (request) => {
    return fastify.userService.findById(request.params.id);
  });
}

export default fp(userRoutes, { name: 'user-routes' });

await fastify.register(userRoutes, { 
  prefix: '/api/users',
  database: databaseConnection 
});