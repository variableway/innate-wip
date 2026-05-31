# Source: https://betterstack.com/community/guides/scaling-nodejs/koa-vs-hapi/
# Original language: javascript
# Normalized: js
# Block index: 11

// Built-in authentication strategies
server.auth.scheme('custom', (server, options) => {
  return {
    authenticate: async (request, h) => {
      const token = request.headers.authorization;
      const user = await validateToken(token);
      return h.authenticated({ credentials: user });
    }
  };
});

server.auth.strategy('jwt', 'custom');
server.auth.default('jwt');

// Route-level security
server.route({
  method: 'GET',
  path: '/admin',
  options: {
    auth: {
      scope: ['admin']
    }
  },
  handler: adminHandler
});