# Source: https://betterstack.com/community/guides/scaling-docker/docker-run/
# Original language: command
# Normalized: sh
# Block index: 28

docker network create app_network
docker run -d --name web --network app_network nginx