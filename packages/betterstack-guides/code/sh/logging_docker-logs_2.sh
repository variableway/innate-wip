# Source: https://betterstack.com/community/guides/logging/docker-logs/
# Original language: command
# Normalized: sh
# Block index: 2

docker inspect -f '{{.LogPath}}' <container>