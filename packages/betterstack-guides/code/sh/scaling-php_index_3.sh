# Source: https://betterstack.com/community/guides/scaling-php/index/
# Original language: command
# Normalized: sh
# Block index: 3

docker run \
  --rm \
  --name laravel-blog-db \
  --env POSTGRES_PASSWORD=admin \
  --env POSTGRES_DB=laravel_blog \
  --volume pg-data:/var/lib/postgresql/data \
  --publish 5432:5432 \
  postgres:bookworm