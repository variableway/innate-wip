# Source: https://betterstack.com/community/guides/scaling-docker/ha-docker-swarm/
# Original language: command
# Normalized: sh
# Block index: 30

docker node update  --availability drain <leader_node_id>