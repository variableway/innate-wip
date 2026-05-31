# Source: https://betterstack.com/community/guides/observability/otlp/
# Original language: javascript
# Normalized: js
# Block index: 7

import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeSDK } from "@opentelemetry/sdk-node";

const exporter = new OTLPTraceExporter();
const sdk = new NodeSDK({
	traceExporter: exporter,
	instrumentations: [
		getNodeAutoInstrumentations(),
	],
});

sdk.start();