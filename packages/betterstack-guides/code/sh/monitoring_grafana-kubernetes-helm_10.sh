# Source: https://betterstack.com/community/guides/monitoring/grafana-kubernetes-helm/
# Original language: command
# Normalized: sh
# Block index: 10

kubectl port-forward $(kubectl get pods -l "app.kubernetes.io/name=grafana" -o jsonpath='{.items[0].metadata.name}') 3000:3000