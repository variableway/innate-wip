# Source: https://betterstack.com/community/guides/observability/opentelemetry-collector-kubernetes-helm/
# Original language: command
# Normalized: sh
# Block index: 9

helm install my-otel-collector open-telemetry/opentelemetry-collector \
  --values collector-values.yaml \
  --set extraEnvs[0].name=<observability_api_key> \
  --set extraEnvs[0].value=<secret-key-123> \
  --set extraEnvs[1].name=<metrics_api_key> \
  --set extraEnvs[1].value=<metrics-key-456> \
  --dry-run