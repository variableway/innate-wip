# Source: https://betterstack.com/community/guides/scaling-docker/trivy-container/
# Original language: command
# Normalized: sh
# Block index: 1

docker run --rm aquasec/trivy image --exit-code 1 --severity CRITICAL nginx:1.21.0