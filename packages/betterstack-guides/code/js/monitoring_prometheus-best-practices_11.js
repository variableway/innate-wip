# Source: https://betterstack.com/community/guides/monitoring/prometheus-best-practices/
# Original language: promql
# Normalized: js
# Block index: 11

errors_total{type="rate_limit_exceeded"}
errors_total{type="timeout"}
errors_total{type="internal_server_error"}