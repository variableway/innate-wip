# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 30

[label src/controllers/root.controller.js]
export function getRoot(request, reply) {
[highlight]
  const { db } = request.server;
  const posts = db.prepare("SELECT * FROM posts").all();
  return reply.view("index", { title: "Homepage", posts });
[/highlight]
}