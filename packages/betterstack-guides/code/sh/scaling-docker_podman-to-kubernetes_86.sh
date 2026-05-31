# Source: https://betterstack.com/community/guides/scaling-docker/podman-to-kubernetes/
# Original language: command
# Normalized: sh
# Block index: 86

minikube kubectl -- patch svc example-8080 --type='json' -p '[{"op":"replace","path":"/spec/type","value":"NodePort"}]