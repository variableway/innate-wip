# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 10

const Hapi = require('@hapi/hapi');
const Basic = require('@hapi/basic');

const init = async () => {
  const server = Hapi.server({ port: 3000 });

  await server.register(Basic);

  server.auth.strategy('simple', 'basic', {
    validate: async (request, username, password, h) => {
      // In a real app, you would validate against a database
      const isValid = username === 'admin' && password === 'password';
      const credentials = { id: '1', name: 'Admin User' };

      return { isValid, credentials };
    }
  });

  server.route({
    method: 'GET',
    path: '/protected',
    options: {
      auth: 'simple',
      handler: (request, h) => {
        return {
          message: 'You accessed the protected route!',
          user: request.auth.credentials
        };
      }
    }
  });

  await server.start();
};

init();