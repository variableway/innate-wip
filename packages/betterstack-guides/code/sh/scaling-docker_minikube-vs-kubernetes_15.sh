# Source: https://betterstack.com/community/guides/scaling-docker/minikube-vs-kubernetes/
# Original language: bash
# Normalized: sh
# Block index: 15

# Create multiple Minikube clusters
minikube start -p cluster1
minikube start -p cluster2

# Create multiple Kind clusters
kind create cluster --name cluster1
kind create cluster --name cluster2