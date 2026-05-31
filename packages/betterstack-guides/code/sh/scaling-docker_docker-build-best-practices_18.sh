# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: command
# Normalized: sh
# Block index: 18

docker run -d \
 --name db \
 -v mysql_data:/var/lib/mysql \
 mysql:8.4