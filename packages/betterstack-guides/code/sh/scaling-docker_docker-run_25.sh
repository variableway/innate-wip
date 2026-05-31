# Source: https://betterstack.com/community/guides/scaling-docker/docker-run/
# Original language: command
# Normalized: sh
# Block index: 25

docker run -d \
 --name web_server \
 -p 80:80 \
 -p 443:443 \
 -v web_content:/usr/share/nginx/html \
 -e NGINX_HOST=example.com \
 --restart unless-stopped \
 nginx