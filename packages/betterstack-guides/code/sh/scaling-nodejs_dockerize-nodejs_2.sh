# Source: https://betterstack.com/community/guides/scaling-nodejs/dockerize-nodejs/
# Original language: command
# Normalized: sh
# Block index: 2

docker run \
  --rm \
  --name url-shortener-db \
  --env POSTGRES_PASSWORD=admin \
  --env POSTGRES_DB=url-shortener \
  --volume pg-data:/var/lib/postgresql/data \
  --publish 5432:5432 \
  postgres:alpine