# Source: https://betterstack.com/community/guides/monitoring/java-prometheus/
# Original language: bash
# Normalized: sh
# Block index: 18

wrk -t 10 -c 100 -d 1m --latency "http://localhost:8080"