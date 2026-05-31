# Source: https://betterstack.com/community/guides/scaling-docker/docker-volumes/
# Original language: command
# Normalized: sh
# Block index: 11

docker run -d \
  --name web_server \
  -v web_content:/usr/share/nginx/html:ro \
  nginx:latest