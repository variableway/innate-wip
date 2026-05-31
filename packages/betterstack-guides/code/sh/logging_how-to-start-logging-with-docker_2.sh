# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/
# Original language: command
# Normalized: sh
# Block index: 2

docker inspect -f '{{.HostConfig.LogConfig.Type}}' <container>