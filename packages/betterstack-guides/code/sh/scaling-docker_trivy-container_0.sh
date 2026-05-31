# Source: https://betterstack.com/community/guides/scaling-docker/trivy-container/
# Original language: command
# Normalized: sh
# Block index: 0

docker run --rm aquasec/trivy image --severity HIGH,CRITICAL nginx:alpine