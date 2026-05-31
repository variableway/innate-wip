# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 13

import Fastify from "fastify";

const fastify = Fastify({ logger: true });

fastify.setErrorHandler((error, request, reply) => {
  reply.status(500).send({ error: error.message });
});

fastify.get("/", async () => {
  throw new Error("Something went wrong!");
});

fastify.listen(3000);