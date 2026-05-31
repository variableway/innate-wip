# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 13

[label src/app.js]
import Fastify from "fastify";
import env from "./config/env.js";
import logger from "./config/logger.js";
[highlight]
import routes from "./routes/routes.js";
[/highlight]

...
[highlight]
await fastify.register(routes);
[/highlight]

fastify.listen({ port: env.port }, (err, address) => {
 ...
});