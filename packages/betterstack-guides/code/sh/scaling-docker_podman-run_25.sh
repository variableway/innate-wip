# Source: https://betterstack.com/community/guides/scaling-docker/podman-run/
# Original language: command
# Normalized: sh
# Block index: 25

podman run -d \
 --name web_server \
 -p 80:80 \
 -p 443:443 \
 -v web_content:/usr/share/caddy \
 -e CADDY_HOST=example.com \
 --restart unless-stopped \
 caddy