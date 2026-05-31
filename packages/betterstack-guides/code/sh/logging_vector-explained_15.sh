# Source: https://betterstack.com/community/guides/logging/vector-explained/
# Original language: command
# Normalized: sh
# Block index: 15

docker run --rm -it \
  -v $(pwd)/input.json:/input.json:ro \
  timberio/vector:latest-alpine \
  vrl --input /input.json