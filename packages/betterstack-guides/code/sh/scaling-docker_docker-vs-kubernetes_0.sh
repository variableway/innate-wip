# Source: https://betterstack.com/community/guides/scaling-docker/docker-vs-kubernetes/
# Original language: bash
# Normalized: sh
# Block index: 0

# Build an image from a Dockerfile
docker build -t myapp .

# Run a container from an image
docker run -d -p 8080:80 myapp

# List running containers
docker ps

# Stop a running container
docker stop container_id