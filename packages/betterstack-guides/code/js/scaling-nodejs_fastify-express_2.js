# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 2

import Fastify from "fastify";

const fastify = Fastify();

fastify.get("/", async (request, reply) => {
  return { message: "Hello from Fastify!" };
});

fastify.listen(3000, () => console.log("Server running on http://localhost:3000"));