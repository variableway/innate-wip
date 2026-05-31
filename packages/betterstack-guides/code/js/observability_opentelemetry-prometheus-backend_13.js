# Source: https://betterstack.com/community/guides/observability/opentelemetry-prometheus-backend/
# Original language: promql
# Normalized: js
# Block index: 13

rate(inventory_items_processed_total[5m])
* on (job, instance) group_left (custom_team)
target_info