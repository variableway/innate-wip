# Source: https://betterstack.com/community/guides/scaling-docker/docker-networks/
# Original language: command
# Normalized: sh
# Block index: 31

# Create a frontend service
docker service create --name frontend \
 --network my_overlay_network \
 -p 80:80 \
 my-frontend-app

# Create a backend service
docker service create --name backend \
 --network my_overlay_network \
 my-backend-app