# Source: https://betterstack.com/community/guides/observability/opentelemetry-best-practices/
# Original language: javascript
# Normalized: js
# Block index: 12

const { Resource } = require('@opentelemetry/resources');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const exporter = new OTLPTraceExporter({
  url: 'http://collector:4318/v1/traces',
  timeoutMillis: 10000  // 10 second timeout for export operations
});

// Configure the processor with limits
const batchProcessor = new BatchSpanProcessor(exporter, {
  maxQueueSize: 2048,           // Limit memory usage
  maxExportBatchSize: 512,      // Reasonable batch size
  exportTimeoutMillis: 30000    // Timeout for exports
});

// Create the provider with the processor
const provider = new NodeTracerProvider({
  resource: new Resource({ 'service.name': 'my-service' })
});
provider.addSpanProcessor(batchProcessor);
provider.register();