# Source: https://betterstack.com/community/guides/monitoring/php-laravel-prometheus/
# Original language: promql
# Normalized: js
# Block index: 32

# HELP app_external_api_request_duration_seconds External API request duration in seconds
# TYPE app_external_api_request_duration_seconds summary
app_external_api_request_duration_seconds{endpoint="posts",quantile="0.5"} 0.342
app_external_api_request_duration_seconds{endpoint="posts",quantile="0.9"} 0.456
app_external_api_request_duration_seconds{endpoint="posts",quantile="0.99"} 0.891
app_external_api_request_duration_seconds_sum{endpoint="posts"} 12.423
app_external_api_request_duration_seconds_count{endpoint="posts"} 32