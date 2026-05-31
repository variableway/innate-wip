# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 38

[label src/controllers/deletePost.controller.js]
export function deletePost(request, reply) {
  const { slug } = request.params;
  const { db } = request.server;

  const deleteStatement = db.prepare("DELETE FROM posts WHERE slug = ?");
  deleteStatement.run(slug);

  return reply.redirect("/");
}