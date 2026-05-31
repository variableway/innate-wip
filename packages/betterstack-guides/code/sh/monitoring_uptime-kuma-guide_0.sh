# Source: https://betterstack.com/community/guides/monitoring/uptime-kuma-guide/
# Original language: command
# Normalized: sh
# Block index: 0

docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1