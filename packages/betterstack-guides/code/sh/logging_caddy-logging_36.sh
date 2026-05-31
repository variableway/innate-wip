# Source: https://betterstack.com/community/guides/logging/caddy-logging/
# Original language: command
# Normalized: sh
# Block index: 36

docker run --name caddy-server -d -p 80:80 -v ./Caddyfile:/etc/caddy/Caddyfile:ro custom-caddy