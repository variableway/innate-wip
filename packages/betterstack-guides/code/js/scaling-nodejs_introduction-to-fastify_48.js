# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 48

[label src/routes/routes.js]
...
[highlight]
import errorHandler from "../middleware/error.js";
[/highlight]

export default async function routes(fastify, options) {
  fastify.get("/", getRoot);
  // Register post routes with the /post prefix
  fastify.register(
    ...
  );
[highlight]
  fastify.setErrorHandler(errorHandler);
[/highlight]
}