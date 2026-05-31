# Source: https://betterstack.com/community/guides/scaling-docker/podman-logging/
# Original language: command
# Normalized: sh
# Block index: 17

for container in $(podman ps -q); do
 podman logs $container > logs_$(podman inspect -f '{{.Name}}' $container | sed 's/^\///').txt
done