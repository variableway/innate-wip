# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: bash
# Normalized: sh
# Block index: 29

#!/bin/bash
# Check if image size exceeds limit
SIZE=$(docker images my-app:latest --format "{{.Size}}" | sed 's/MB//')
if (( $(echo "$SIZE > 200" | bc -l) )); then
  echo "Image size of ${SIZE}MB exceeds the 200MB limit"
  exit 1
fi