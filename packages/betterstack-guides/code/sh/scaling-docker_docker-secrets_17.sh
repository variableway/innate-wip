# Source: https://betterstack.com/community/guides/scaling-docker/docker-secrets/
# Original language: command
# Normalized: sh
# Block index: 17

docker container exec $(docker ps --filter name=<container-name> -q) ls -l /run/secrets