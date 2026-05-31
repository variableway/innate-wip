# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 30

fastify.register(async function (subsystem) {
  await subsystem.register(require("@fastify/express"));
  subsystem.use(require("cors")());
});