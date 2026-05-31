# Source: https://betterstack.com/community/guides/scaling-docker/dozzle-docker/
# Original language: command
# Normalized: sh
# Block index: 1

docker run --name dozzle -d -v /var/run/docker.sock:/var/run/docker.sock -p 8080:8080 amir20/dozzle:latest --no-analytics