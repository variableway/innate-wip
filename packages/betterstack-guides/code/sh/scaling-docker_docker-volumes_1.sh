# Source: https://betterstack.com/community/guides/scaling-docker/docker-volumes/
# Original language: command
# Normalized: sh
# Block index: 1

docker volume create --driver local \
  --opt type=none \
  --opt device=/home/user/data \
  --opt o=bind \
  my_custom_volume