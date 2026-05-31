# Source: https://betterstack.com/community/guides/scaling-docker/podman-run/
# Original language: command
# Normalized: sh
# Block index: 17

podman run -d --name web_server -p 80:80 -v web_data:/usr/share/caddy caddy