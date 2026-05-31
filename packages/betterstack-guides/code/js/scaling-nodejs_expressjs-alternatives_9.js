# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 9

// Install: npm install @hapi/hapi @hapi/joi
const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  // Define routes
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return { message: 'Hello World!' };
    }
  });

  // Route with parameter validation
  server.route({
    method: 'GET',
    path: '/users/{id}',
    options: {
      validate: {
        params: Joi.object({
          id: Joi.string().required().min(3)
        }),
        query: Joi.object({
          fields: Joi.string().optional()
        }),
        failAction: (request, h, err) => {
          throw err;
        }
      }
    },
    handler: async (request, h) => {
      const { id } = request.params;
      // Fetch user from database
      return { id, name: 'Sample User' };
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();