# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 16

import "./otel.js";
[highlight]
import { metrics } from "@opentelemetry/api";
[/highlight]
import Fastify from "fastify";

[highlight]
const meter = metrics.getMeter(process.env.OTEL_SERVICE_NAME);

const httpRequestCounter = meter.createCounter("http.server.requests", {
	description: "Total number of HTTP requests received.",
	unit: "{requests}",
});
[/highlight]

const fastifyApp = Fastify({
	logger: true,
});

fastifyApp.get("/", (req, reply) => {
[highlight]
	httpRequestCounter.add(1);
[/highlight]
	reply.send("Hello World!");
});

const address = await fastifyApp.listen({
	host: "0.0.0.0",
	port: process.env.PORT || "8000",
});