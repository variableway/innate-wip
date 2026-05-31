# Source: https://betterstack.com/community/guides/scaling-docker/docker-networks/
# Original language: command
# Normalized: sh
# Block index: 32

docker run -d --name custom_dns \
 --dns 8.8.8.8 \
 --dns-search example.com \
 nginx