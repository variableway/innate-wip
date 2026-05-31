# Source: https://betterstack.com/community/guides/scaling-docker/podman-logging/
# Original language: command
# Normalized: sh
# Block index: 18

podman run -d --name web-server --log-opt max-size=10m --log-opt max-file=3 nginx