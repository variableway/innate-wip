# Source: https://betterstack.com/community/guides/scaling-docker/docker-secrets/
# Original language: command
# Normalized: sh
# Block index: 20

echo "newPassword123" | docker secret create db_password_v2 -