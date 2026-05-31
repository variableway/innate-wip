# Source: https://betterstack.com/community/guides/monitoring/prometheus-best-practices/
# Original language: promql
# Normalized: js
# Block index: 3

rate(api_failures_total[5m]) / (rate(api_successes_total[5m]) + rate(api_failures_total[5m]))