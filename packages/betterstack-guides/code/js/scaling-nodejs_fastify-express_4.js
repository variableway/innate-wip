# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 4

const fastify = require("fastify")();

fastify.register(async (app) => {
  app.get("/users", async () => "User List");
}, { prefix: "/api/v1" });

fastify.listen(3000);