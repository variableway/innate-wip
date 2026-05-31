# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 29

fastify.get("/users", async (request, reply) => {
  return { message: "Users from Fastify!" };
});