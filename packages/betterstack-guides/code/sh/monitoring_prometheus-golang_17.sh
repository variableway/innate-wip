# Source: https://betterstack.com/community/guides/monitoring/prometheus-golang/
# Original language: command
# Normalized: sh
# Block index: 17

wrk -t 10 -c 400 -d 5m --latency "http://localhost:8000"