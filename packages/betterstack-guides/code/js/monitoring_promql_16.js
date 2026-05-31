# Source: https://betterstack.com/community/guides/monitoring/promql/
# Original language: promql
# Normalized: js
# Block index: 16

rate(node_cpu_seconds_total{mode="idle"}[5m] offset 1h)