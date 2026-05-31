# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 24

[label src/controllers/createPost.controller.js]
import slugify from "slugify";

export function getNewPost(request, reply) {
  return reply.view("new", { title: "Create New Post" });
}

export function createPost(request, reply) {
  const { title, content } = request.body;
  const slug = slugify(title, { lower: true, strict: true });
  const { db } = request.server;
  const insertStatement = db.prepare(
    "INSERT INTO posts (title, slug, content) VALUES (?, ?, ?)"
  );
  insertStatement.run(title, slug, content);
  return reply.redirect("/");
}