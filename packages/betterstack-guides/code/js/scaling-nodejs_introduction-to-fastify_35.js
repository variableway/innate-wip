# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 35

[label src/controllers/editPost.controller.js]
import slugify from "slugify";

export function getEditPost(request, reply) {
  const { slug } = request.params;
  const { db } = request.server;
  const post = db.prepare("SELECT * FROM posts WHERE slug = ?").get(slug);

  if (!post) {
    return reply.status(404).send({ error: "Post not found" });
  }

  return reply.view("edit", { title: "Edit Post", post });
}

export function editPost(request, reply) {
  const { slug } = request.params;
  const { title, content } = request.body;
  const newSlug = slugify(title, { lower: true, strict: true });
  const { db } = request.server;

  const updateStatement = db.prepare(
    "UPDATE posts SET title = ?, slug = ?, content = ? WHERE slug = ?"
  );

  updateStatement.run(title, newSlug, content, slug);

  return reply.redirect(`/post/${newSlug}`);
}