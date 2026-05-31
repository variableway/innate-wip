# Source: https://betterstack.com/community/guides/scaling-docker/podman-logging/
# Original language: command
# Normalized: sh
# Block index: 24

podman run -d --name app -v app-logs:/var/log/app my-application