# Source: https://betterstack.com/community/guides/monitoring/prometheus-storage-retention/
# Original language: command
# Normalized: sh
# Block index: 1

curl -s http://localhost:9090/api/v1/status/runtimeinfo | grep retention