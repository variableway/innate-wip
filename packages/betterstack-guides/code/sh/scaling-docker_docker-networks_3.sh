# Source: https://betterstack.com/community/guides/scaling-docker/docker-networks/
# Original language: command
# Normalized: sh
# Block index: 3

docker run -d --name isolated_container --network none alpine sleep infinity