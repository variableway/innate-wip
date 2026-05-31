# Source: https://betterstack.com/community/guides/scaling-docker/podman-run/
# Original language: command
# Normalized: sh
# Block index: 14

podman run -d --name web_server -p 8080:80 -p 8443:443 caddy