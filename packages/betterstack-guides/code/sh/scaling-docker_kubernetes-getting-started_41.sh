# Source: https://betterstack.com/community/guides/scaling-docker/kubernetes-getting-started/
# Original language: command
# Normalized: sh
# Block index: 41

kubectl create deployment example --image=nginx --dry-run=client -o yaml