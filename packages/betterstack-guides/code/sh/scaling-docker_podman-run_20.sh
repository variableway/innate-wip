# Source: https://betterstack.com/community/guides/scaling-docker/podman-run/
# Original language: command
# Normalized: sh
# Block index: 20

podman run --entrypoint /bin/bash caddy -c "echo Hello, custom entrypoint!"