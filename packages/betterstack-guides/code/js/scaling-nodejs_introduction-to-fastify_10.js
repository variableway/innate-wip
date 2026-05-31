# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 10

[label src/controllers/root.controller.js]
export async function getRoot(request, reply) {
  return "Blog app demo";
}