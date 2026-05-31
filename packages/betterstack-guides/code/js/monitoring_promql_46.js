# Source: https://betterstack.com/community/guides/monitoring/promql/
# Original language: promql
# Normalized: js
# Block index: 46

rate(node_cpu_seconds_total{mode="idle"}[5m])