# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/
# Original language: command
# Normalized: sh
# Block index: 9

docker run --log-driver syslog --log-opt syslog-address=tcp://192.168.1.10:514 -d <image>