# Source: https://betterstack.com/community/guides/logging/crontab-logs/
# Original language: command
# Normalized: sh
# Block index: 11

grep -E "error|fail|denied|status: [1-9]" /var/log/cron