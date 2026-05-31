# Source: https://betterstack.com/community/guides/observability/opentelemetry-collector-kubernetes-helm/
# Original language: command
# Normalized: sh
# Block index: 18

helm upgrade my-otel-collector open-telemetry/opentelemetry-collector \
  --values updated-values.yaml