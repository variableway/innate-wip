# Source: https://betterstack.com/community/guides/observability/opentelemetry-collector-kubernetes-helm/
# Original language: command
# Normalized: sh
# Block index: 13

kubectl create secret generic otel-secrets \
  --from-literal=observability-api-key=<secret-key-123> \
  --from-literal=metrics-api-key=<metrics-key-456>