# Source: https://betterstack.com/community/guides/observability/opentelemetry-collector-kubernetes-helm/
# Original language: command
# Normalized: sh
# Block index: 20

kubectl create secret generic betterstack-secrets \
  --from-literal=source-token=<your-betterstack-source-token> \
  --from-literal=ingesting-host=<your-betterstack-ingesting-host>