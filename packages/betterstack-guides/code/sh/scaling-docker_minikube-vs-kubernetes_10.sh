# Source: https://betterstack.com/community/guides/scaling-docker/minikube-vs-kubernetes/
# Original language: bash
# Normalized: sh
# Block index: 10

# macOS with Homebrew
brew install minikube

# Linux
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Windows with Chocolatey
choco install minikube