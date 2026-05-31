# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-php/
# Original language: promql
# Normalized: js
# Block index: 26

histogram_quantile(0.95, sum(rate(http_request_duration_bucket[5m])) by (le))