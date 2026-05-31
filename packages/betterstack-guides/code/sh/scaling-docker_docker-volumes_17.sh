# Source: https://betterstack.com/community/guides/scaling-docker/docker-volumes/
# Original language: command
# Normalized: sh
# Block index: 17

docker run --rm \
  -v app_config:/config \
  alpine:latest \
  sh -c 'echo "server_url=https://example.com" > /config/app.conf'