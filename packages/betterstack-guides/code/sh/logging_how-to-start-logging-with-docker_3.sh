# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/
# Original language: command
# Normalized: sh
# Block index: 3

docker inspect -f '{{.LogPath}}' <container>