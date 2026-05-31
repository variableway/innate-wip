# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-nginx-access-and-error-logs/
# Original language: command
# Normalized: sh
# Block index: 50

docker logs -f vector | jq -R 'fromjson? | select(type == "object")'