# Source: https://betterstack.com/community/guides/observability/opentelemetry-best-practices/
# Original language: javascript
# Normalized: js
# Block index: 0

// Initialize OpenTelemetry first - before other library imports
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

// Create and configure the tracer provider
const provider = new NodeTracerProvider();
const exporter = new OTLPTraceExporter({
  url: 'http://collector:4318/v1/traces'
});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

// Register auto-instrumentations
registerInstrumentations({
  instrumentations: [
    // Add your instrumentations here
  ],
});

// Now import your application modules
const express = require('express');
const app = express();