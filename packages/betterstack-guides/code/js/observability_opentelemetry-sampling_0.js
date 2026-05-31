# Source: https://betterstack.com/community/guides/observability/opentelemetry-sampling/
# Original language: javascript
# Normalized: js
# Block index: 0

[otel.js]
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeSDK } from "@opentelemetry/sdk-node";
[highlight]
import { TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-node";
[/highlight]

const exporter = new OTLPTraceExporter();

const sdk = new NodeSDK({
	traceExporter: exporter,
	instrumentations: [getNodeAutoInstrumentations()],
[highlight]
	sampler: new TraceIdRatioBasedSampler(0.1), // sample 10% of traces
[/highlight]
});

sdk.start();