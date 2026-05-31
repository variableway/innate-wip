# Source: https://betterstack.com/community/guides/scaling-nodejs/dockerize-nodejs/
# Original language: command
# Normalized: sh
# Block index: 30

docker run \
  --rm \
  --name url-shortener-app \
  --publish 5000:5000 \
  --env-file .env \
[highlight]
  --network url-shortener \
[/highlight]
  url-shortener