# Source: https://betterstack.com/community/guides/scaling-docker/docker-volumes/
# Original language: command
# Normalized: sh
# Block index: 15

docker run -d \
  --name mysql_db_new \
  -v mysql_data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=my-secret-pw \
  -p 3306:3306 \
  mysql:8.0