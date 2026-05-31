# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 6

...
fastify.get("/", function handler(request, reply) {
[highlight]
  return "Blog app demo";
[/highlight]
});
...