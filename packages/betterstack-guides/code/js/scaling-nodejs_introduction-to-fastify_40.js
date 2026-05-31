# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 40

[label src/app.js]
...
const fastify = Fastify({
  logger: logger,
});

fastify.addHook("onRequest", async (request, reply) => {
  request.log.info(`Incoming request: ${request.method} ${request.url}`);
});

fastify.addHook("onResponse", async (request, reply) => {
  request.log.info(
    `Request completed: ${request.method} ${request.url} - Status ${reply.statusCode}`
  );
});
...