# Source: https://betterstack.com/community/guides/scaling-docker/ha-docker-swarm/
# Original language: command
# Normalized: sh
# Block index: 43

docker node update --availability drain <manager_node_id>