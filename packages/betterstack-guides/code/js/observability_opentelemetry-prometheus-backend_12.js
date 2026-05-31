# Source: https://betterstack.com/community/guides/observability/opentelemetry-prometheus-backend/
# Original language: promql
# Normalized: js
# Block index: 12

rate(inventory_items_processed_total{deployment_environment="production"}[5m])