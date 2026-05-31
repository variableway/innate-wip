# Source: https://betterstack.com/community/guides/monitoring/prometheus-storage-retention/
# Original language: command
# Normalized: sh
# Block index: 28

ps -A | grep prometheus | tr -s ' ' | xargs | cut -f1 -d' ' | xargs kill -HUP