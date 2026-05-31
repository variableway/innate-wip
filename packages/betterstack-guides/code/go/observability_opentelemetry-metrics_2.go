# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics/
# Original language: go
# Normalized: go
# Block index: 2

meter := meterProvider.Meter("example-meter", metric.WithInstrumentationVersion("0.1.0"))