# Source: https://betterstack.com/community/guides/scaling-go/index/
# Original language: command
# Normalized: sh
# Block index: 21

docker run --rm --name go-blog-app --publish 8000:8000 --env-file .env go-blog