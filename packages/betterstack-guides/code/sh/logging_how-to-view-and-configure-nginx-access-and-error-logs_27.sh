# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-nginx-access-and-error-logs/
# Original language: command
# Normalized: sh
# Block index: 27

docker run --name nginx-server --rm -p 80:80 -v ./nginx.conf:/etc/nginx/nginx.conf:ro nginx