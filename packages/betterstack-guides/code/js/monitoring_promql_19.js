# Source: https://betterstack.com/community/guides/monitoring/promql/
# Original language: promql
# Normalized: js
# Block index: 19

node_cpu_seconds_total{mode="idle"} offset 1h @ 1732616754
# This is equivalent to
node_cpu_seconds_total{mode="idle"} @ 1732616754 offset 1h