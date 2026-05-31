# Source: https://betterstack.com/community/guides/scaling-docker/podman-run/
# Original language: command
# Normalized: sh
# Block index: 30

podman run -d --name secure_container \
 --security-opt="no-new-privileges:true" \
 --cap-drop=ALL \
 --cap-add=NET_BIND_SERVICE \
 caddy