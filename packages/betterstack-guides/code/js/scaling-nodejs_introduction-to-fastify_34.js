# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 34

[label src/routes/routes.js]
...
[highlight]
import { getPost } from "../controllers/getPost.controller.js";
[/highlight]

export default async function routes(fastify, options) {
  ...
  fastify.register(
    async function (postRoutes) {
      postRoutes.get("/new", getNewPost);
      postRoutes.post("/", createPost);
[highlight]
      postRoutes.get("/:slug", getPost);
[/highlight]
    },
    { prefix: "/post" }
  );
}
...