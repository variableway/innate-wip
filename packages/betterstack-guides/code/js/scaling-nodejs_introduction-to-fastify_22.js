# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 22

[label src/app.js]
...
import logger from "./config/logger.js";
import routes from "./routes/routes.js";
[highlight]
import dbConnector from "./config/db.js";
[/highlight]
...

[highlight]
fastify.register(dbConnector);
[/highlight]
await fastify.register(routes);
...