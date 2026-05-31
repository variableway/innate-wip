# Source: https://betterstack.com/community/guides/monitoring/prometheus-golang/
# Original language: command
# Normalized: sh
# Block index: 15

wrk -t 1 -c 1 -d 300s --latency "http://localhost:8000