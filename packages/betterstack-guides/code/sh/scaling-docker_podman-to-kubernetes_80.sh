# Source: https://betterstack.com/community/guides/scaling-docker/podman-to-kubernetes/
# Original language: command
# Normalized: sh
# Block index: 80

podman create --pod example --name caddy docker.io/library/caddy:2.7.6-alpine