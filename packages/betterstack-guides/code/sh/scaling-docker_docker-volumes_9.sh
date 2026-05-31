# Source: https://betterstack.com/community/guides/scaling-docker/docker-volumes/
# Original language: command
# Normalized: sh
# Block index: 9

docker run -d \
  --name postgres_db2 \
  --mount source=my_postgres_data2,target=/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=mysecretpassword \
  postgres:14