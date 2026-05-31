# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 52

[label src/app.js]
...
import fastifyFormbody from "@fastify/formbody";
[highlight]
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyCompress from "@fastify/compress";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";
[/highlight]
...

const createServer = async () => {
  ...
[highlight]
  await fastify.register(fastifyCors);
  await fastify.register(fastifyHelmet);
  await fastify.register(fastifyCompress);
  await fastify.register(fastifyGracefulShutdown);
[/highlight]
  await fastify.register(fastifyFormbody);
  fastify.register(dbConnector);

  await fastify.register(routes);

  return fastify;
};

export default createServer;