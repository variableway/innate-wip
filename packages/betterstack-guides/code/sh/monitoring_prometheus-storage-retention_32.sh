# Source: https://betterstack.com/community/guides/monitoring/prometheus-storage-retention/
# Original language: command
# Normalized: sh
# Block index: 32

time curl -s "http://localhost:9090/api/v1/query?query=rate(node_cpu_seconds_total[30d])"