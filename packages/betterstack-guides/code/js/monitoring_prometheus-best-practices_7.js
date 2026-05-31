# Source: https://betterstack.com/community/guides/monitoring/prometheus-best-practices/
# Original language: promql
# Normalized: js
# Block index: 7

rate(db_queries_total[5m]) > 10