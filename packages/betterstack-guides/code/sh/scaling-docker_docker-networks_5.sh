# Source: https://betterstack.com/community/guides/scaling-docker/docker-networks/
# Original language: command
# Normalized: sh
# Block index: 5

docker network create -d macvlan \
 --subnet=192.168.1.0/24 \
 --gateway=192.168.1.1 \
 -o parent=eth0 \
 my_macvlan_network