# Source: https://betterstack.com/community/guides/monitoring/prometheus-best-practices/
# Original language: promql
# Normalized: js
# Block index: 0

order_status_total{status="completed"}
order_status_total{status="pending"}
order_status_total{status="canceled"}