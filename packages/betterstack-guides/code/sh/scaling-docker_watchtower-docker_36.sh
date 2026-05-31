# Source: https://betterstack.com/community/guides/scaling-docker/watchtower-docker/
# Original language: command
# Normalized: sh
# Block index: 36

docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --run-once \
  demo-custom-node