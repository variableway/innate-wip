# Source: https://betterstack.com/community/guides/scaling-nodejs/koa-vs-hapi/
# Original language: javascript
# Normalized: js
# Block index: 3

// Feature-rich setup with minimal code
const server = Hapi.server({ port: 3000 });

server.route({
  method: 'GET',
  path: '/users',
  options: {
    auth: 'jwt',
    cache: { expiresIn: 60000 },
    validate: {
      query: Joi.object({
        page: Joi.number().default(1)
      })
    }
  },
  handler: async (request) => {
    return await User.findAll({ page: request.query.page });
  }
});