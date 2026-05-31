# Source: https://betterstack.com/community/guides/scaling-docker/podman-logging/
# Original language: command
# Normalized: sh
# Block index: 13

podman logs web-server | grep -E "(warning|error|critical)"