# Source: https://betterstack.com/community/guides/scaling-docker/docker-networks/
# Original language: command
# Normalized: sh
# Block index: 30

# Initialize a swarm
docker swarm init

# Create a service with multiple replicas
docker service create --name web \
 --network my_overlay_network \
 --replicas 3 \
 -p 80:80 \
 nginx