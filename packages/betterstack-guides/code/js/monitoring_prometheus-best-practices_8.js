# Source: https://betterstack.com/community/guides/monitoring/prometheus-best-practices/
# Original language: promql
# Normalized: js
# Block index: 8

rate(db_queries_total{service="my_database_service"}[5m]) > 10