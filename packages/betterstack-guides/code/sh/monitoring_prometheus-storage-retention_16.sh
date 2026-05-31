# Source: https://betterstack.com/community/guides/monitoring/prometheus-storage-retention/
# Original language: command
# Normalized: sh
# Block index: 16

kubectl exec -it prometheus-0 -n monitoring -- \
  curl -s http://localhost:9090/api/v1/status/runtimeinfo | grep retention