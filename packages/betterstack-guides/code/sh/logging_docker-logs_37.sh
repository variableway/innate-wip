# Source: https://betterstack.com/community/guides/logging/docker-logs/
# Original language: command
# Normalized: sh
# Block index: 37

docker run -d --name vector \
    -v $(pwd)/vector.yaml:/etc/vector/vector.yaml:ro \
    -v /var/run/docker.sock:/var/run/docker.sock \
    timberio/vector:latest-alpine