# Source: https://betterstack.com/community/guides/scaling-docker/docker-networks/
# Original language: command
# Normalized: sh
# Block index: 17

docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' web_app