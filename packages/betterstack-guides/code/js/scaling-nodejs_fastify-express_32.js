# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 32

fastify.register(async (instance) => {
  instance.get("/user", async () => "User API v1");
}, { prefix: "/v1" });