# Source: https://betterstack.com/community/guides/logging/logging-best-practices/
# Original language: command
# Normalized: sh
# Block index: 10

wrk -t 1 -c 10 -d 10s --latency http://localhost:8080/login