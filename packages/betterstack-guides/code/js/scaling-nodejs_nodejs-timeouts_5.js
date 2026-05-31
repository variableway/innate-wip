# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-timeouts/
# Original language: javascript
# Normalized: js
# Block index: 5

import Fastify from 'fastify';

const fastify = Fastify({
  connectionTimeout: 10000, // Corresponds to server.timeout
  keepAliveTimeout: 3000, // Defaults to 72 secomds
  requestTimeout: 5000, // Defaults to no timeout
});

fastify.server.headersTimeout = 2000;