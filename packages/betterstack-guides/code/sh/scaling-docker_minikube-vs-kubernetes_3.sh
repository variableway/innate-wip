# Source: https://betterstack.com/community/guides/scaling-docker/minikube-vs-kubernetes/
# Original language: bash
# Normalized: sh
# Block index: 3

# View available add-ons
minikube addons list

# Enable an add-on
minikube addons enable ingress

# Disable an add-on
minikube addons disable dashboard