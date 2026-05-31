# Source: https://betterstack.com/community/guides/monitoring/prometheus-exporter/
# Original language: command
# Normalized: sh
# Block index: 2

docker run --rm --entrypoint=cat nginx /etc/nginx/nginx.conf > nginx.conf