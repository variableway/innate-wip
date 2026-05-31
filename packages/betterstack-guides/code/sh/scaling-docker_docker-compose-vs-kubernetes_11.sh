# Source: https://betterstack.com/community/guides/scaling-docker/docker-compose-vs-kubernetes/
# Original language: command
# Normalized: sh
# Block index: 11

kubectl logs -l app=web
kubectl exec -it pod/web-app-54d9b6775f-abcd1 -- /bin/bash
kubectl describe deployment web-app