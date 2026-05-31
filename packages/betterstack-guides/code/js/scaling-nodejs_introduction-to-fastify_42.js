# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 42

[label root.controller.js]
export async function getRoot(request, reply) {
  const { db } = request.server;
[highlight]
  const posts = db.prepare("SELECT * FROM unkown_table").all();
[/highlight]
  return reply.view("index", { title: "Homepage", posts });
}