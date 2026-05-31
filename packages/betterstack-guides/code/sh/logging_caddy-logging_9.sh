# Source: https://betterstack.com/community/guides/logging/caddy-logging/
# Original language: command
# Normalized: sh
# Block index: 9

docker run -d \
 --name caddy-server \
 -p 80:80 \
 -v ./Caddyfile:/etc/caddy/Caddyfile:ro \
 caddy