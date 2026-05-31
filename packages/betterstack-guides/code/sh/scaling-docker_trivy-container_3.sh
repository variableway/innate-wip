# Source: https://betterstack.com/community/guides/scaling-docker/trivy-container/
# Original language: command
# Normalized: sh
# Block index: 3

docker run --rm -v $(pwd):/project aquasec/trivy config --severity HIGH,CRITICAL /project