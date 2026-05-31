# Source: https://betterstack.com/community/guides/monitoring/promql/
# Original language: promql
# Normalized: js
# Block index: 13

rate(prometheus_http_requests_total{code=~"4.."}[5m])