# Source: https://betterstack.com/community/guides/scaling-docker/trivy-container/
# Original language: command
# Normalized: sh
# Block index: 4

docker run --rm -v $(pwd):/project aquasec/trivy fs --severity HIGH,CRITICAL /project