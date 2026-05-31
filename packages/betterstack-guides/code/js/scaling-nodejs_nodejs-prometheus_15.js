# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-prometheus/
# Original language: javascript
# Normalized: js
# Block index: 15

[label index.js]
...
[highlight]
import { register, Counter } from "prom-client";
[/highlight]

const fastify = Fastify({ logger: true });

[highlight]
// Prometheus metrics
const requestCounter = new Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route"],
  });
[/highlight]
...
fastify.get("/", async (request, reply) => {
[highlight]
  requestCounter.labels(request.method, request.routerPath).inc();
[/highlight]
  ...
  return rows.splice(0, 8);
});

fastify.listen({ port: 3000 }, (err) => {
  ...
});