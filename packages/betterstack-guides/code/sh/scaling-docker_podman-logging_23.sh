# Source: https://betterstack.com/community/guides/scaling-docker/podman-logging/
# Original language: command
# Normalized: sh
# Block index: 23

podman run -d --name web-server --log-driver=fluentd --log-opt fluentd-address=localhost:24224 nginx