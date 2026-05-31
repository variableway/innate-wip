# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 28

[label src/app.js]
...
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
[highlight]
import fastifyFormbody from "@fastify/formbody";
[/highlight]
...

[highlight]
await fastify.register(fastifyFormbody);
[/highlight]
fastify.register(dbConnector);
...