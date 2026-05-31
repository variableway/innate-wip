# Source: https://betterstack.com/community/guides/scaling-docker/docker-run/
# Original language: command
# Normalized: sh
# Block index: 15

docker run -d --name web_server -p 80:80 -v /my/local/path:/usr/share/nginx/html nginx