# Source: https://betterstack.com/community/guides/observability/opentelemetry-nodejs-tracing/
# Original language: javascript
# Normalized: js
# Block index: 32

[label otel.js]
// . . .

const sdk = new NodeSDK({
	traceExporter: exporter,
	instrumentations: [
[highlight]
		getNodeAutoInstrumentations({
			"@opentelemetry/instrumentation-http": {
				requestHook: (span, request) => {
					span.updateName(`HTTP ${request.method} ${request.url}`);
				},
			},
		}),
[/highlight]
	],
});