# Source: https://betterstack.com/community/guides/observability/opentelemetry-best-practices/
# Original language: javascript
# Normalized: js
# Block index: 11

const exporter = new OTLPTraceExporter({
  url: 'http://collector:4318/v1/traces',
  compression: 'gzip'  // Enable compression
});