# Source: https://betterstack.com/community/guides/scaling-nodejs/koa-vs-hapi/
# Original language: javascript
# Normalized: js
# Block index: 13

const Boom = require('@hapi/boom');

// Standardized error responses
server.route({
  handler: async (request) => {
    const user = await User.findById(request.params.id);
    if (!user) {
      throw Boom.notFound('User not found');
    }
    return user;
  }
});

// Global error formatting
server.ext('onPreResponse', (request, h) => {
  if (request.response.isBoom) {
    const error = request.response;
    return h.response({
      statusCode: error.output.statusCode,
      message: error.message,
      timestamp: new Date().toISOString()
    }).code(error.output.statusCode);
  }
  return h.continue;
});