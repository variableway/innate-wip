# Source: https://betterstack.com/community/guides/monitoring/prometheus-best-practices/
# Original language: promql
# Normalized: js
# Block index: 10

alert: HighAPILatency
expr:  histogram_quantile(0.95, sum by (le) (rate(api_request_duration_seconds_bucket[5m]))) > 0.5
[highlight]
for: 10m
[/highlight]