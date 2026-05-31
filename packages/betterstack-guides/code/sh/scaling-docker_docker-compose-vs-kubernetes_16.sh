# Source: https://betterstack.com/community/guides/scaling-docker/docker-compose-vs-kubernetes/
# Original language: command
# Normalized: sh
# Block index: 16

kubectl set image deployment/web-app nginx=nginx:1.22 --record