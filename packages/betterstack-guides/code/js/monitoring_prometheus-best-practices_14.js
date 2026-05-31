# Source: https://betterstack.com/community/guides/monitoring/prometheus-best-practices/
# Original language: promql
# Normalized: js
# Block index: 14

(rate(errors_total{type="timeout"}[10m]) or up * 0) / (rate(errors_total[10m]) or up * 0)