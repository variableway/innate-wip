# Source: https://betterstack.com/community/guides/scaling-docker/kind/
# Original language: command
# Normalized: sh
# Block index: 31

kubectl wait --namespace ingress-nginx \
 --for=condition=ready pod \
 --selector=app.kubernetes.io/component=controller \
 --timeout=90s