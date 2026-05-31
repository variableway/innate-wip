# Source: https://betterstack.com/community/guides/monitoring/prometheus-best-practices/
# Original language: promql
# Normalized: js
# Block index: 1

order_status_total{status="completed",product_id="1"}
order_status_total{status="completed",product_id="2"}
order_status_total{status="completed",product_id="3"}
. . .
order_status_total{status="completed",product_id="999999"}