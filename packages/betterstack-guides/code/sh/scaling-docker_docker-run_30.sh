# Source: https://betterstack.com/community/guides/scaling-docker/docker-run/
# Original language: command
# Normalized: sh
# Block index: 30

docker run -d --name secure_container \
 --security-opt="no-new-privileges:true" \
 --cap-drop=ALL \
 --cap-add=NET_BIND_SERVICE \
 nginx