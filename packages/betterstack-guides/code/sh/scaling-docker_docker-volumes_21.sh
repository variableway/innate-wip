# Source: https://betterstack.com/community/guides/scaling-docker/docker-volumes/
# Original language: command
# Normalized: sh
# Block index: 21

docker run -d \
  --name postgres_anon \
  -v /var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=mysecretpassword \
  postgres:14