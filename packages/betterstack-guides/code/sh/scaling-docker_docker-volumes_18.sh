# Source: https://betterstack.com/community/guides/scaling-docker/docker-volumes/
# Original language: command
# Normalized: sh
# Block index: 18

docker run -d \
  --name app1 \
  -v app_config:/etc/myapp \
  myapp:latest