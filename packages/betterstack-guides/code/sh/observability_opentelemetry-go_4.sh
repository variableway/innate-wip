# Source: https://betterstack.com/community/guides/observability/opentelemetry-go/
# Original language: command
# Normalized: sh
# Block index: 4

go get go.opentelemetry.io/otel \
  go.opentelemetry.io/otel/exporters/stdout/stdouttrace \
  go.opentelemetry.io/otel/sdk/trace \
  go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp