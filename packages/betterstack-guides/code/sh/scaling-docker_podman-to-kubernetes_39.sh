# Source: https://betterstack.com/community/guides/scaling-docker/podman-to-kubernetes/
# Original language: command
# Normalized: sh
# Block index: 39

podman create --pod dummy-pod --publish 8081:80 docker.io/library/caddy:2.7.6-alpine