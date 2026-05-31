# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 12

[label src/app.js]
const fastify = Fastify({
  logger: logger,
});

// remove the following
[highlight]
fastify.get("/", function handler(request, reply) {
  return "Blog app demo";
});
[/highlight]
...