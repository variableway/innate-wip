# Source: https://betterstack.com/community/guides/scaling-docker/docker-secrets/
# Original language: command
# Normalized: sh
# Block index: 4

echo "mySecurePassword123" | docker secret create db_password -