# Source: https://betterstack.com/community/guides/scaling-docker/docker-secrets/
# Original language: command
# Normalized: sh
# Block index: 23

docker service create \
    --name restricted_service \
    --secret source=required_secret,mode=0400 \
    --no-resolve-image \
    myapp:latest