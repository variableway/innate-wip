# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: promql
# Normalized: js
# Block index: 26

histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[1m])) by (le))