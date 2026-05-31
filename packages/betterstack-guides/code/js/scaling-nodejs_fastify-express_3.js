# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 3

import Fastify from "fastify";

const fastify = Fastify();

fastify.register(async (instance) => {
  instance.get("/user", async () => "User API v1");
}, { prefix: "/v1" });

fastify.register(async (instance) => {
  instance.get("/user", async () => "User API v2");
}, { prefix: "/v2" });

fastify.listen(3000);