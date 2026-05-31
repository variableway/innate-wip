# Source: https://betterstack.com/community/guides/monitoring/prometheus-storage-retention/
# Original language: command
# Normalized: sh
# Block index: 20

curl -s "http://localhost:9090/api/v1/query?query=rate(prometheus_tsdb_head_samples_appended_total[1h])" | jq