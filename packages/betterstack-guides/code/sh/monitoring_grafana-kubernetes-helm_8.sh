# Source: https://betterstack.com/community/guides/monitoring/grafana-kubernetes-helm/
# Original language: command
# Normalized: sh
# Block index: 8

kubectl get secret grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo