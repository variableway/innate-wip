# Source: https://betterstack.com/community/guides/monitoring/visualize-prometheus-metrics-grafana/
# Original language: promql
# Normalized: js
# Block index: 10

node_time_seconds{instance="node-exporter:9100",job="node-exporter"} - node_boot_time_seconds{instance="node-exporter:9100",job="node-exporter"}