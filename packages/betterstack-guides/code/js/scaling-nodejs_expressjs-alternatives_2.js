# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 2

// Install: npm install @fastify/express
const fastify = require('fastify')();
const expressPlugin = require('@fastify/express');

// Register the plugin
await fastify.register(expressPlugin);

// Now you can use Express middleware
fastify.use(require('cors')());
fastify.use(require('helmet')());

// And Express-style middleware functions
fastify.use((req, res, next) => {
  req.user = getUser(req);
  next();
});