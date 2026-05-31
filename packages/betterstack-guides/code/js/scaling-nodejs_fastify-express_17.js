# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 17

import Fastify from "fastify";

const fastify = Fastify({ logger: true });

fastify.get("/", (req, reply) => {
  req.log.info("Request received"); // Log request information
  reply.send({ message: "Hello, Fastify!" });
});

fastify.listen(3000, () => {
  console.log("Fastify server running on http://localhost:3000");
});