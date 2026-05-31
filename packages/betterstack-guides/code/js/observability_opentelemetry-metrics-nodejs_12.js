# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 12

[label otel.js]
[highlight]
import { FastifyInstrumentation } from "@opentelemetry/instrumentation-fastify";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
[/highlight]
import { Resource } from "@opentelemetry/resources";

. . .

const sdk = new NodeSDK({
	resource,
	metricReader,
[highlight]
	instrumentations: [new HttpInstrumentation(), new FastifyInstrumentation()],
[/highlight]
});

. . .