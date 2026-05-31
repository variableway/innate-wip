# Source: https://betterstack.com/community/guides/scaling-docker/monitor-docker-containers/
# Original language: command
# Normalized: sh
# Block index: 29

docker inspect web-app --format='{{json .State.Health}}' | jq