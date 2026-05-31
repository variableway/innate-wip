# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 22

[label main.js]
[highlight]
const memoryUsageObservableGuage = meter.createObservableGauge(
	"system.memory.heap",
	{
		description: "Memory usage of the allocated heap objects.",
		unit: "By",
	},
);
memoryUsageObservableGuage.addCallback((result) => {
	result.observe(process.memoryUsage().heapUsed);
});
[/highlight]

const fastifyApp = Fastify({
	logger: true,
});

. . .