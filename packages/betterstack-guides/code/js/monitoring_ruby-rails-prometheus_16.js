# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: promql
# Normalized: js
# Block index: 16

HELP http_requests_total Total number of HTTP requests received
TYPE http_requests_total counter
http_requests_total{method="GET",path="/metrics",status="200"} 2