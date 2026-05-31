# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/
# Original language: command
# Normalized: sh
# Block index: 11

docker run --log-driver syslog --log-opt mode=non-blocking <image>