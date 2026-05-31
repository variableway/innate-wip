# Source: https://betterstack.com/community/guides/scaling-nodejs/dockerize-nodejs/
# Original language: command
# Normalized: sh
# Block index: 24

docker run --rm --name url-shortener-app --publish 5000:5000 --env-file .env url-shortener