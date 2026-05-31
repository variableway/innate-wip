# Source: https://betterstack.com/community/guides/monitoring/promql/
# Original language: promql
# Normalized: js
# Block index: 42

sum(node_cpu_seconds_total) without (cpu)