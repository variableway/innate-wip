# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 39

[label src/routes/routes.js]
...
[highlight]
import { deletePost } from "../controllers/deletePost.controller.js";
[/higlight]

export default async function routes(fastify, options) {
  ...
  fastify.register(
    async function (postRoutes) {
      ...
      postRoutes.post("/:slug/edit", editPost);
[highlight]
      postRoutes.post("/:slug/delete", deletePost);
[/highlight]
    },
    { prefix: "/post" }
  );
}