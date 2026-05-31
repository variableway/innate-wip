# Source: https://betterstack.com/community/guides/scaling-docker/monitor-docker-containers/
# Original language: command
# Normalized: sh
# Block index: 34

while true; do docker ps --format 'table {{.Names}}\t{{.Status}}'; sleep 2; done