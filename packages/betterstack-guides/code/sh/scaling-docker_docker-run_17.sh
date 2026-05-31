# Source: https://betterstack.com/community/guides/scaling-docker/docker-run/
# Original language: command
# Normalized: sh
# Block index: 17

docker run -d --name web_server -p 80:80 -v web_data:/usr/share/nginx/html nginx