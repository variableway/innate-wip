# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 16

[label src/controllers/root.controller.js]
export function getRoot(request, reply) {
[highlight]
  return reply.view("index", { title: "Homepage"});
[/highlight]
}