# Source: https://betterstack.com/community/guides/observability/opentelemetry-prometheus-backend/
# Original language: javascript
# Normalized: js
# Block index: 3

[label otel.js]
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
	MeterProvider,
	PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { NodeSDK, metrics } from "@opentelemetry/sdk-node";
import {
	ATTR_SERVICE_NAME,
	ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

const resource = Resource.default().merge(
	new Resource({
		[ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME,
		[ATTR_SERVICE_VERSION]: "0.1.0",
	}),
);

const metricReader = new PeriodicExportingMetricReader({
	exporter: new OTLPMetricExporter(),

	// Default is 60000ms (60 seconds). Set to 3 seconds for demonstrative purposes only.
	exportIntervalMillis: 3000,
});

const sdk = new NodeSDK({
	resource,
	metricReader,
});

process.on("beforeExit", async () => {
	await sdk.shutdown();
});

sdk.start();