# Source: https://betterstack.com/community/guides/scaling-nodejs/koa-vs-hapi/
# Original language: javascript
# Normalized: js
# Block index: 1

const Hapi = require('@hapi/hapi');
const server = Hapi.server({ port: 3000 });

server.route({
  method: 'POST',
  path: '/users',
  options: {
    validate: {
      payload: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required()
      })
    }
  },
  handler: async (request) => {
    return await UserService.create(request.payload);
  }
});