# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 11

[label src/routes/routes.js]
import { getRoot } from "../controllers/root.controller.js";

export default async function routes(fastify, options) {
  fastify.get("/", getRoot);
}