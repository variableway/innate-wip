# Source: https://betterstack.com/community/guides/scaling-docker/docker-run/
# Original language: command
# Normalized: sh
# Block index: 18

docker run -d --name db -e MYSQL_ROOT_PASSWORD=secretpassword -e MYSQL_DATABASE=myapp mysql:5.7