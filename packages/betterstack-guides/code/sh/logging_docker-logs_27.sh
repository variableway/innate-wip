# Source: https://betterstack.com/community/guides/logging/docker-logs/
# Original language: command
# Normalized: sh
# Block index: 27

docker inspect -f '{{ index .HostConfig.LogConfig.Config "cache-disabled" }}' <container>