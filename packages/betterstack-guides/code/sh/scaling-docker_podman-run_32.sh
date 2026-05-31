# Source: https://betterstack.com/community/guides/scaling-docker/podman-run/
# Original language: command
# Normalized: sh
# Block index: 32

podman run -d --name labeled_container \
 --label environment=production \
 --label application=frontend \
 caddy