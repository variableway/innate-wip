# Source: https://betterstack.com/community/guides/scaling-docker/docker-security-best-practices/
# Original language: command
# Normalized: sh
# Block index: 2

docker run --read-only --tmpfs /tmp ubuntu sh -c 'echo "whatever" > /tmp/file'