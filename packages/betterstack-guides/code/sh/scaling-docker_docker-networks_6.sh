# Source: https://betterstack.com/community/guides/scaling-docker/docker-networks/
# Original language: command
# Normalized: sh
# Block index: 6

docker network create --driver bridge \
 --subnet=172.18.0.0/16 \
 --gateway=172.18.0.1 \
 my_network