# Source: https://betterstack.com/community/guides/scaling-docker/podman-run/
# Original language: command
# Normalized: sh
# Block index: 28

podman network create app_network
podman run -d --name web --network app_network caddy