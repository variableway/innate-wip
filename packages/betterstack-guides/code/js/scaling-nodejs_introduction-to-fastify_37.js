# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 37

[label src/routes/routes.js]
...
import { getPost } from "../controllers/getPost.controller.js";
[highlight]
import { getEditPost, editPost } from "../controllers/editPost.controller.js";
[/highlight]

export default async function routes(fastify, options) {
  fastify.get("/", getRoot);
  fastify.register(
    async function (postRoutes) {
...
[highlight]
      postRoutes.get("/:slug/edit", getEditPost);
      postRoutes.post("/:slug/edit", editPost);
[/highlight]
    },
    { prefix: "/post" }
  );
}