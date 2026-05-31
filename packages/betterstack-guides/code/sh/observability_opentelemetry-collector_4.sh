# Source: https://betterstack.com/community/guides/observability/opentelemetry-collector/
# Original language: command
# Normalized: sh
# Block index: 4

docker run -v $(pwd)/otelcol.yaml:/etc/otelcol-contrib/config.yaml otel/opentelemetry-collector-contrib:latest