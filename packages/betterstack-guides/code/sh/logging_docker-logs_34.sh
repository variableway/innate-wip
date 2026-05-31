# Source: https://betterstack.com/community/guides/logging/docker-logs/
# Original language: command
# Normalized: sh
# Block index: 34

docker run --name dozzle -d --volume=/var/run/docker.sock:/var/run/docker.sock -p 8888:8080 amir20/dozzle:latest