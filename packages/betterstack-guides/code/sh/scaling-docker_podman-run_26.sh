# Source: https://betterstack.com/community/guides/scaling-docker/podman-run/
# Original language: command
# Normalized: sh
# Block index: 26

podman run -d --name resource_limited \
 --memory="512m" \
 --cpus="0.5" \
 caddy