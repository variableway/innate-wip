# Source: https://betterstack.com/community/guides/scaling-docker/docker-volumes/
# Original language: command
# Normalized: sh
# Block index: 27

docker run -d \
  --name secure_nginx \
  --user $(id -u):$(id -g) \
  -v web_content:/usr/share/nginx/html \
  nginx:latest