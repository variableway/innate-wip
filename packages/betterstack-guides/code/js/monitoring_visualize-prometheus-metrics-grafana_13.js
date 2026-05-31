# Source: https://betterstack.com/community/guides/monitoring/visualize-prometheus-metrics-grafana/
# Original language: promql
# Normalized: js
# Block index: 13

1 -  (node_filesystem_avail_bytes{mountpoint="/",instance="node-exporter:9100"} / node_filesystem_size_bytes{mountpoint="/",instance="node-exporter:9100"})