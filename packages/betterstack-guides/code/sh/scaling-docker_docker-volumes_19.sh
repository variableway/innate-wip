# Source: https://betterstack.com/community/guides/scaling-docker/docker-volumes/
# Original language: command
# Normalized: sh
# Block index: 19

docker run -d \
  --name app2 \
  -v app_config:/etc/myapp \
  myapp:latest