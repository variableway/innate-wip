# Source: https://betterstack.com/community/guides/logging/caddy-logging/
# Original language: command
# Normalized: sh
# Block index: 39

docker run \
 -d \
 --name vector \
 -v ./vector.yaml:/etc/vector/vector.yaml \
 -v /var/run/docker.sock:/var/run/docker.sock:ro \
 timberio/vector:latest-alpine