# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-golang/
# Original language: command
# Normalized: sh
# Block index: 25

wrk -t 10 -c400 -d 10s --latency "http://localhost:8000"