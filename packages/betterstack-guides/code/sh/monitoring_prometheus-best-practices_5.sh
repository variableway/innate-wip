# Source: https://betterstack.com/community/guides/monitoring/prometheus-best-practices/
# Original language: command
# Normalized: sh
# Block index: 5

rate(api_failures_total[5m]) / rate(api_requests_total[5m])