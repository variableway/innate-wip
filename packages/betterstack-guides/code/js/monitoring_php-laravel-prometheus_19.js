# Source: https://betterstack.com/community/guides/monitoring/php-laravel-prometheus/
# Original language: promql
# Normalized: js
# Block index: 19

# HELP app_http_requests_total Total number of HTTP requests
# TYPE app_http_requests_total counter
app_http_requests_total{status="200",path="metrics",method="GET"} 2
app_http_requests_total{status="200",path="/",method="GET"} 1