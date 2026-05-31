# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-nginx-access-and-error-logs/
# Original language: command
# Normalized: sh
# Block index: 21

docker run --name nginx-server -v ./nginx.conf:/etc/nginx/nginx.conf:ro -d nginx