# Source: https://betterstack.com/community/guides/monitoring/prometheus-kubernetes-helm/
# Original language: command
# Normalized: sh
# Block index: 18

kubectl port-forward $(kubectl get pods -l app.kubernetes.io/name=prometheus,app.kubernetes.io/instance=prometheus -o jsonpath='{.items[0].metadata.name}') 9090