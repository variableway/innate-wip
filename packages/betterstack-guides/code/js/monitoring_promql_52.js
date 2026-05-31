# Source: https://betterstack.com/community/guides/monitoring/promql/
# Original language: promql
# Normalized: js
# Block index: 52

rate(http_request_duration_seconds_bucket{le="1"}[5m])