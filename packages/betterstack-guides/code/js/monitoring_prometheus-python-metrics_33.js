# Source: https://betterstack.com/community/guides/monitoring/prometheus-python-metrics/
# Original language: promql
# Normalized: js
# Block index: 33

histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[1m])) by (le))