# Source: https://betterstack.com/community/guides/monitoring/prometheus-python-metrics/
# Original language: command
# Normalized: sh
# Block index: 25

wrk -t 10 -c 100 -d 1m --latency "http://localhost:8000"