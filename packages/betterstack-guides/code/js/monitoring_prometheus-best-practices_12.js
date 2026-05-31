# Source: https://betterstack.com/community/guides/monitoring/prometheus-best-practices/
# Original language: promql
# Normalized: js
# Block index: 12

sum(rate(errors_total{type="host_unreachable"}[5m]))