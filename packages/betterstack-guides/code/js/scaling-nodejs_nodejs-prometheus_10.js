# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-prometheus/
# Original language: javascript
# Normalized: js
# Block index: 10

[label index.js]
...
[highlight]
import metricsPlugin from "fastify-metrics";
[/highlight]

const fastify = Fastify({ logger: true });
[highlight]
await fastify.register(metricsPlugin, { endpoint: "/metrics" });
[/highlight]
...