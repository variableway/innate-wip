# Source: https://betterstack.com/community/guides/observability/opentelemetry-nodejs-tracing/
# Original language: javascript
# Normalized: js
# Block index: 23

[otel.js]
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
[highlight]
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
[/highlight]
import { NodeSDK } from "@opentelemetry/sdk-node";

[highlight]
const exporter = new OTLPTraceExporter();
[/highlight]
const sdk = new NodeSDK({
[highlight]
	traceExporter: exporter,
[/highlight]
	instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();