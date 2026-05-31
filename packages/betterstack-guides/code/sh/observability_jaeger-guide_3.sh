# Source: https://betterstack.com/community/guides/observability/jaeger-guide/
# Original language: command
# Normalized: sh
# Block index: 3

docker run \
  --rm \
  --name hotrod \
  --link jaeger \
  --env OTEL_EXPORTER_OTLP_ENDPOINT=http://jaeger:4318 \
  -p 8080-8083:8080-8083 \
  jaegertracing/example-hotrod:latest \
  all