# Source: https://betterstack.com/community/guides/observability/opentelemetry-collector-kubernetes-helm/
# Original language: command
# Normalized: sh
# Block index: 21

helm install betterstack-collector open-telemetry/opentelemetry-collector \
  --values values.yaml \
  --set extraEnvs[0].name=SOURCE_TOKEN \
  --set extraEnvs[0].valueFrom.secretKeyRef.name=betterstack-secrets \
  --set extraEnvs[0].valueFrom.secretKeyRef.key=source-token \
  --set extraEnvs[0].name=INGESTING_HOST \
  --set extraEnvs[0].valueFrom.secretKeyRef.name=betterstack-secrets \
  --set extraEnvs[0].valueFrom.secretKeyRef.key=ingesting-host