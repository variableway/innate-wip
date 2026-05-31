# Source: https://betterstack.com/community/guides/scaling-docker/minikube-vs-kubernetes/
# Original language: bash
# Normalized: sh
# Block index: 17

[label ci-test-script.sh]
#!/bin/bash
# Create a Kind cluster for testing
kind create cluster

# Deploy the application
kubectl apply -f kubernetes/

# Run tests
go test ./e2e/...

# Clean up
kind delete cluster