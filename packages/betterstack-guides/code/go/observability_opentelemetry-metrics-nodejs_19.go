# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-nodejs/
# Original language: go
# Normalized: go
# Block index: 19

[label main.js]
import "./otel.js";
import { metrics } from "@opentelemetry/api";
import Fastify from "fastify";

const meter = metrics.getMeter(process.env.OTEL_SERVICE_NAME);

const httpRequestCounter = meter.createCounter("http.server.requests", {
	description: "Total number of HTTP requests received.",
	unit: "{requests}",
});
[highlight]
const activeRequestUpDownCounter = meter.createUpDownCounter(
	"http.server.active_requests",
	{
		description: "Number of in-flight requests.",
		unit: "{requests}",
	},
);
[/highlight]

const fastifyApp = Fastify({
	logger: true,
});

fastifyApp.get("/", async (req, reply) => {
	httpRequestCounter.add(1);
[highlight]
	activeRequestUpDownCounter.add(1);
	await new Promise((resolve) => setTimeout(resolve, 5000));
[/highlight]
	reply.send("Hello World!");
[highlight]
	activeRequestUpDownCounter.add(-1);
[/highlight]
});

const address = await fastifyApp.listen({
	host: "0.0.0.0",
	port: process.env.PORT || "8000",
});