# Source: https://betterstack.com/community/guides/scaling-docker/docker-volumes/
# Original language: command
# Normalized: sh
# Block index: 22

docker inspect postgres_anon -f '{{ .Mounts }}'