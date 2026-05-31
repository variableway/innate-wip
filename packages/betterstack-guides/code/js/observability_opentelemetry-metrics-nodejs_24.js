# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 24

import "./otel.js";
[highlight]
import { PerformanceObserver, performance } from "node:perf_hooks";
[/highlight]
import { metrics } from "@opentelemetry/api";
import Fastify from "fastify";

. . .
[highlight]
const requestDurHistogram = meter.createHistogram(
	"http.client.request.duration",
	{
		description: "The duration of an outgoing HTTP request.",
		unit: "s",
		advice: {
			explicitBucketBoundaries: [
				0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1, 2.5, 5, 7.5, 10,
			],
		},
	},
);
[/highlight]

const fastifyApp = Fastify({
	logger: true,
});

[highlight]
const observer = new PerformanceObserver((list) => {
	for (const entry of list.getEntries()) {
		if (entry.initiatorType === "fetch") {
			requestDurHistogram.record(entry.duration / 1000, {
				url: entry.name,
			});
		}
	}

	performance.clearResourceTimings();
});

observer.observe({ entryTypes: ["resource"] });
[/highlight]

fastifyApp.get("/", async (req, reply) => {
	httpRequestCounter.add(1);
	activeRequestUpDownCounter.add(1);
	await new Promise((resolve) => setTimeout(resolve, 5000));
	reply.send("Hello World!");
	activeRequestUpDownCounter.add(-1);
});

[highlight]
fastifyApp.get("/posts", async (_request, reply) => {
	const response = await fetch("https://jsonplaceholder.typicode.com/posts");
	reply.send(await response.json());
});
[/highlight]