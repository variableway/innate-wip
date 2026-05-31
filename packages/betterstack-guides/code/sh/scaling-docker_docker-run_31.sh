# Source: https://betterstack.com/community/guides/scaling-docker/docker-run/
# Original language: command
# Normalized: sh
# Block index: 31

docker run -d --name labeled_container \
 --label environment=production \
 --label application=frontend \
 nginx