# Source: https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/
# Original language: javascript
# Normalized: js
# Block index: 2

const fastify = require('fastify')({
  logger: true, // enables the built-in Pino logger
});

// You can subsequently write logs like this
fastify.log.info('an info message');

// or log within request handlers like this:
fastify.get('/', options, function (request, reply) {
  request.log.info('info about the current request');
  reply.send({ msg: 'hello world!' });
})