# Source: https://betterstack.com/community/guides/monitoring/prometheus-best-practices/
# Original language: promql
# Normalized: js
# Block index: 6

# success rate
1 - (rate(http_requests_failures_total[5m]) / rate(http_requests_total[5m]))