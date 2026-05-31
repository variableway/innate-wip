# Source: https://betterstack.com/community/guides/monitoring/prometheus-best-practices/
# Original language: promql
# Normalized: js
# Block index: 16

alert: HighCPUUsage
expr: node_cpu_seconds_total{mode="idle"} < 0.1
labels:
  severity: warning
annotations:
  summary: "High CPU usage on {{ $labels.instance }}"
  description: "Instance {{ $labels.instance }} has high CPU usage (idle: {{ $value }})"