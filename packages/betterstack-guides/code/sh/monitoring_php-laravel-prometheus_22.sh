# Source: https://betterstack.com/community/guides/monitoring/php-laravel-prometheus/
# Original language: command
# Normalized: sh
# Block index: 22

wrk -t 10 -c 100 -d 1m --latency "http://localhost:8000"