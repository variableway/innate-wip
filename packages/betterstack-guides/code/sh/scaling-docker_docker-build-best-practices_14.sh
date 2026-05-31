# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: command
# Normalized: sh
# Block index: 14

# Without .dockerignore, everything gets sent to Docker daemon
$ docker build -t myapp .