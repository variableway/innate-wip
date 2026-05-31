# Source: https://betterstack.com/community/guides/scaling-docker/podman-run/
# Original language: command
# Normalized: sh
# Block index: 27

podman run -d --name monitored_container \
 --health-cmd="curl -f http://localhost/ || exit 1" \
 --health-interval=30s \
 --health-timeout=10s \
 --health-retries=3 \
 caddy