# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 19

// Express app for existing routes
const express = require('express');
const expressApp = express();

// Fastify app for new routes
const fastify = require('fastify')();

// Set up Express routes
expressApp.get('/legacy-route', (req, res) => {
  res.json({ legacy: true });
});

// Set up Fastify routes
fastify.get('/new-route', async (request, reply) => {
  return { new: true };
});

// Run both servers on different ports
expressApp.listen(3000);
fastify.listen({ port: 3001 });

// Or proxy between them with a gateway