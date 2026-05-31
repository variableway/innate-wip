# Source: https://betterstack.com/community/guides/monitoring/promql/
# Original language: promql
# Normalized: js
# Block index: 54

histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))