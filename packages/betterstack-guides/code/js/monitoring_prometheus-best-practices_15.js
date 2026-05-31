# Source: https://betterstack.com/community/guides/monitoring/prometheus-best-practices/
# Original language: promql
# Normalized: js
# Block index: 15

alert: HighCPUUsage
expr: avg(node_cpu_seconds_total{mode="idle"}) by (instance) < 0.1