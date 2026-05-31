# Source: https://betterstack.com/community/guides/observability/jaeger-guide/
# Original language: command
# Normalized: sh
# Block index: 1

docker run \
  --rm \
  --name jaeger \
  -p 4318:4318 \
  -p 16686:16686 \
  -p 14268:14268 \
  jaegertracing/all-in-one:latest