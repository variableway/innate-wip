# Source: https://betterstack.com/community/guides/scaling-docker/monitor-docker-containers/
# Original language: command
# Normalized: sh
# Block index: 11

for i in {1..100}; do curl -s http://localhost:3000 > /dev/null; done