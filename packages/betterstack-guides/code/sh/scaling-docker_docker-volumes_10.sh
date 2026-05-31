# Source: https://betterstack.com/community/guides/scaling-docker/docker-volumes/
# Original language: command
# Normalized: sh
# Block index: 10

docker run -d \
  --name web_server \
  --mount source=web_content,target=/usr/share/nginx/html,readonly \
  nginx:latest