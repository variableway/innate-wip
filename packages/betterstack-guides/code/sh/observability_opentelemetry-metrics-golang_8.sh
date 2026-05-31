# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-golang/
# Original language: command
# Normalized: sh
# Block index: 8

go get go.opentelemetry.io/otel \
  go.opentelemetry.io/otel/exporters/stdout/stdoutmetric \
  go.opentelemetry.io/otel/sdk/resource \
  go.opentelemetry.io/otel/sdk/metric \
  go.opentelemetry.io/otel/semconv/v1.26.0 \
  go.opentelemetry.io/otel/attribute \
  go.opentelemetry.io/otel/sdk/instrumentation