# Source: https://betterstack.com/community/guides/scaling-docker/watchtower-docker/
# Original language: command
# Normalized: sh
# Block index: 1

docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  demo-ubuntu