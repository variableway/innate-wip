# Source: https://betterstack.com/community/guides/scaling-nodejs/full-text-search-in-postgres-with-typescript/
# Original language: command
# Normalized: sh
# Block index: 3

[label Optional - if you don't already have PostgreSQL up & running]
docker run -d --name postgres-article-search -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password -e POSTGRES_DB=article_search -p 5432:5432 postgres:latest