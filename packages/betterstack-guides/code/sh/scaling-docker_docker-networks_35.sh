# Source: https://betterstack.com/community/guides/scaling-docker/docker-networks/
# Original language: command
# Normalized: sh
# Block index: 35

docker inspect -f '{{json .NetworkSettings.Networks}}' web_container | jq