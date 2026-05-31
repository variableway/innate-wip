# Source: https://betterstack.com/community/guides/scaling-docker/docker-secrets/
# Original language: command
# Normalized: sh
# Block index: 16

docker service update --secret-rm db_password <container-name>