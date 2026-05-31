# Source: https://betterstack.com/community/guides/scaling-docker/minikube-vs-kubernetes/
# Original language: bash
# Normalized: sh
# Block index: 13

# List Minikube add-ons
minikube addons list

# With Kind, you need to install components manually
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml