# Source: https://betterstack.com/community/guides/monitoring/php-laravel-prometheus/
# Original language: promql
# Normalized: js
# Block index: 28

histogram_quantile(0.95, sum(rate(app_http_request_duration_seconds_bucket[5m])) by (le))