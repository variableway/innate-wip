# Source: https://betterstack.com/community/guides/scaling-nodejs/migrating-from-express-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 5

// Fastify plugin approach
import jwt from 'jsonwebtoken';
import fp from 'fastify-plugin';

async function authPlugin(fastify, options) {
  fastify.decorateRequest('user', null);
  
  fastify.addHook('preHandler', async (request, reply) => {
    const token = request.headers.authorization;
    if (!token) throw new Error('No token provided');
    
    request.user = jwt.verify(token, options.secret);
  });
}

await fastify.register(authPlugin, { 
  secret: process.env.JWT_SECRET,
  prefix: '/api/protected'
});