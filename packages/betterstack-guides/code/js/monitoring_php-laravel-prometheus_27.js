# Source: https://betterstack.com/community/guides/monitoring/php-laravel-prometheus/
# Original language: promql
# Normalized: js
# Block index: 27

# HELP app_http_request_duration_seconds HTTP request duration in seconds
# TYPE app_http_request_duration_seconds histogram
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="0.1"} 12
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="0.25"} 25
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="0.5"} 45
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="0.75"} 78
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="1.0"} 89
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="2.5"} 95
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="5.0"} 98
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="7.5"} 99
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="10.0"} 100
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="+Inf"} 100
app_http_request_duration_seconds_sum{status="200",path="/",method="GET"} 47.423
app_http_request_duration_seconds_count{status="200",path="/",method="GET"} 100