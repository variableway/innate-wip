# Source: https://betterstack.com/community/guides/monitoring/promql/
# Original language: promql
# Normalized: js
# Block index: 50

avg(1 - rate(node_cpu_seconds_total{mode="idle"}[5m])) by (cpu)