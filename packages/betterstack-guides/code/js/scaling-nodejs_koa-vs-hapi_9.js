# Source: https://betterstack.com/community/guides/scaling-nodejs/koa-vs-hapi/
# Original language: javascript
# Normalized: js
# Block index: 9

// Advanced routing with automatic validation
server.route({
  method: 'GET',
  path: '/users/{id}',
  options: {
    validate: {
      params: Joi.object({
        id: Joi.number().integer().positive()
      })
    },
    response: {
      schema: Joi.object({
        id: Joi.number(),
        name: Joi.string(),
        email: Joi.string().email()
      })
    }
  },
  handler: async (request) => {
    return await User.findById(request.params.id);
  }
});