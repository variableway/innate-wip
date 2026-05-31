# Source: https://betterstack.com/community/guides/scaling-docker/docker-run/
# Original language: command
# Normalized: sh
# Block index: 26

docker run -d --name resource_limited \
 --memory="512m" \
 --cpus="0.5" \
 nginx