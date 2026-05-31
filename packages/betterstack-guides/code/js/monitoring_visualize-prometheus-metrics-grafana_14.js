# Source: https://betterstack.com/community/guides/monitoring/visualize-prometheus-metrics-grafana/
# Original language: promql
# Normalized: js
# Block index: 14

node_time_seconds{instance="node-exporter:9100",job="$job"} - node_boot_time_seconds{instance="node-exporter:9100",job="$job"}