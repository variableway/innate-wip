# Source: https://betterstack.com/community/guides/logging/docker-logs/
# Original language: command
# Normalized: sh
# Block index: 26

docker inspect -f '{{.HostConfig.LogConfig.Type}}' <container>