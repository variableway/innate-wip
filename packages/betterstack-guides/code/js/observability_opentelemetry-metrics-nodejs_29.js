# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 29

[label otel.js]
[highlight]
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
[/highlight]

. . .

const metricReader = new PeriodicExportingMetricReader({
[highlight]
	exporter: new OTLPMetricExporter(),
[/highlight]

	// Default is 60000ms (60 seconds). Set to 3 seconds for demonstrative purposes only.
	exportIntervalMillis: 3000,
});

. . .