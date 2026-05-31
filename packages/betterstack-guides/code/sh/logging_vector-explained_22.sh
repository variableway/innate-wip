# Source: https://betterstack.com/community/guides/logging/vector-explained/
# Original language: command
# Normalized: sh
# Block index: 22

docker run --rm \
  -v $(pwd)/vector/vector.yaml:/etc/vector/vector.yaml:ro \
  -v /var/log/logify:/var/log/logify:ro \
  timberio/vector:latest-alpine \
  --config /etc/vector/vector.yaml