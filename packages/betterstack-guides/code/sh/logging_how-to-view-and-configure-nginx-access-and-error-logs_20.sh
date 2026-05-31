# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-nginx-access-and-error-logs/
# Original language: command
# Normalized: sh
# Block index: 20

docker run --rm --entrypoint=cat nginx /etc/nginx/nginx.conf > nginx.conf