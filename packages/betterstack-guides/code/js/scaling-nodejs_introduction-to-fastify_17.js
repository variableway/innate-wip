# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 17

[label src/app.js]
...
[highlight]
import path from "node:path";
import fastifyView from "@fastify/view";
import ejs from "ejs";

const __dirname = import.meta.dirname;
[/highlight]

const fastify = Fastify({
  logger: logger,
});

[highlight]
await fastify.register(fastifyView, {
  engine: {
    ejs,
  },
  root: path.join(__dirname, "views"),
  viewExt: "ejs",
  layout: "layout.ejs",
});
[/highlight]

await fastify.register(routes);
...