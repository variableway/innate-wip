# Source: https://betterstack.com/community/guides/scaling-nodejs/migrating-from-express-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 9

// Fastify error handling
fastify.setErrorHandler(async (error, request, reply) => {
  request.log.error(error);
  
  if (error.validation) {
    return reply.status(400).send({
      error: 'Validation Error',
      message: 'Request validation failed',
      details: error.validation
    });
  }
  
  if (error.statusCode >= 500) {
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Something went wrong'
    });
  }
  
  return reply.send(error);
});