# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-nodejs/
# Original language: command
# Normalized: sh
# Block index: 20

wrk -t 10 -c400 -d 10s --latency "http://localhost:8000"