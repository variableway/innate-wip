# Source: https://betterstack.com/community/guides/scaling-nodejs/koa-vs-hapi/
# Original language: javascript
# Normalized: js
# Block index: 5

// Configuration-driven approach requires learning new concepts
server.route({
  method: 'POST',
  path: '/users',
  options: {
    pre: [
      { method: validateInput, assign: 'validation' },
      { method: checkPermissions, assign: 'auth' }
    ],
    validate: {
      payload: Joi.object({
        name: Joi.string().required()
      })
    }
  },
  handler: async (request) => {
    return request.pre.validation;
  }
});