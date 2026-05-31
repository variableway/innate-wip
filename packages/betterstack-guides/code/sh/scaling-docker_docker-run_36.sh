# Source: https://betterstack.com/community/guides/scaling-docker/docker-run/
# Original language: command
# Normalized: sh
# Block index: 36

docker container prune     # Remove all stopped containers
docker image prune         # Remove unused images
docker volume prune        # Remove unused volumes
docker system prune -a     # Remove everything unused