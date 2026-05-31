# Source: https://betterstack.com/community/guides/scaling-docker/monitor-docker-containers/
# Original language: command
# Normalized: sh
# Block index: 17

docker inspect web-app --format='{{.State.Running}}'