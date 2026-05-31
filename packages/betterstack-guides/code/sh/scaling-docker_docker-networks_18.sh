# Source: https://betterstack.com/community/guides/scaling-docker/docker-networks/
# Original language: command
# Normalized: sh
# Block index: 18

# Start a database container
docker run -d --name db --network my_network postgres:14

# Start a web container and connect to the database using the container name
docker run -d --name web --network my_network \
 -e "DATABASE_URL=postgres://postgres:postgres@db:5432/postgres" \
 my-web-application