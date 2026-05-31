# Source: https://betterstack.com/community/guides/scaling-go/index/
# Original language: command
# Normalized: sh
# Block index: 2

docker run \
  --rm \
  --name go-blog-db \
  --env POSTGRES_PASSWORD=admin \
  --env POSTGRES_DB=go-blog \
  --volume pg-data:/var/lib/postgresql/data \
  --publish 5432:5432 \
  postgres:bookworm