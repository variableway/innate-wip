# Source: https://betterstack.com/community/guides/scaling-docker/docker-networks/
# Original language: command
# Normalized: sh
# Block index: 4

# Initialize a swarm first (on the manager node)
docker swarm init

# Create an overlay network
docker network create --driver overlay my_overlay_network