# Source: https://betterstack.com/community/guides/observability/opentelemetry-best-practices/
# Original language: javascript
# Normalized: js
# Block index: 10

const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const exporter = new OTLPTraceExporter({
  url: 'http://collector:4318/v1/traces'
});

// Configure batch processing for better performance
const batchProcessor = new BatchSpanProcessor(exporter, {
  maxQueueSize: 2048,            // Maximum queue size
  maxExportBatchSize: 512,       // Number of spans to send at once
  scheduledDelayMillis: 5000,    // How frequently to send batches
  exportTimeoutMillis: 30000     // How long to wait for the export to complete
});

// Add the processor to your provider
provider.addSpanProcessor(batchProcessor);