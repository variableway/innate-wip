# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: command
# Normalized: sh
# Block index: 6

docker run \
  --rm \
  --name postgres \
  --env POSTGRES_PASSWORD=admin \
  --env POSTGRES_DB=prisma_demo \
  --volume pg-data:/var/lib/postgresql/data \
  --publish 5432:5432 \
  postgres:bookworm