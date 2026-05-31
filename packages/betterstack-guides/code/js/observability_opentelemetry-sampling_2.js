# Source: https://betterstack.com/community/guides/observability/opentelemetry-sampling/
# Original language: javascript
# Normalized: js
# Block index: 2

const span = tracer.startSpan("my-operation");
if span.isRecording() {
  // do your expensive computation here
}