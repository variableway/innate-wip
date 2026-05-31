# Source: https://betterstack.com/community/guides/monitoring/prometheus-golang/
# Original language: command
# Normalized: sh
# Block index: 25

wrk -t 1 -c 5 -d 10s --latency "http://localhost:8000/posts"