# Source: https://betterstack.com/community/guides/testing/nodejs-test-runner/
# Original language: javascript
# Normalized: js
# Block index: 38

[label app.js]
import Fastify from 'fastify';

function buildFastify() {
  const fastify = Fastify();

  fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' });
  });

  return fastify;
}

export default buildFastify;