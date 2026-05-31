# Source: https://betterstack.com/community/guides/scaling-docker/kind/
# Original language: command
# Normalized: sh
# Block index: 55

docker build -t localhost:5000/my-app:latest .
docker push localhost:5000/my-app:latest