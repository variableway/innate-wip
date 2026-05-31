# Source: https://betterstack.com/community/guides/scaling-docker/docker-networks/
# Original language: command
# Normalized: sh
# Block index: 15

docker run -d --name multi_network_container --network first_network nginx
docker network connect second_network multi_network_container