# Source: https://betterstack.com/community/guides/scaling-docker/kind/
# Original language: command
# Normalized: sh
# Block index: 51

docker run -d --name registry --network kind-registry -p 5000:5000 registry:2