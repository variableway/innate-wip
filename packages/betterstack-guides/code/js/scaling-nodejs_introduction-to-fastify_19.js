# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 19

[label src/app.js]
import Fastify from "fastify";
import fastifyView from "@fastify/view";
[higlight]
import fastifyStatic from "@fastify/static";
[/highlight]
...

await fastify.register(fastifyView, {
  ...
});

[highlight]
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/public/",
});
[/highlight]
...