# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 26

[label src/routes/routes.js]
import { getRoot } from "../controllers/root.controller.js";
[highlight]
import {
  getNewPost,
  createPost,
} from "../controllers/createPost.controller.js";
[/highlight]
export default async function routes(fastify, options) {
  fastify.get("/", getRoot);
[highlight]
  // Register post routes with the /post prefix
  fastify.register(
    async function (postRoutes) {
      postRoutes.get("/new", getNewPost);
      postRoutes.post("/", createPost);
    },
    { prefix: "/post" }
  );
[/highlight]
}