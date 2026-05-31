# Source: https://betterstack.com/community/guides/scaling-docker/podman-run/
# Original language: command
# Normalized: sh
# Block index: 18

podman run -d --name db -e MYSQL_ROOT_PASSWORD=secretpassword -e MYSQL_DATABASE=myapp mysql:5.7