# Source: https://betterstack.com/community/guides/monitoring/prometheus-relabeling/
# Original language: promql
# Normalized: js
# Block index: 2

http_requests_total{method="GET", code="200"} 10
http_requests_total{method="POST", code="404"} 2