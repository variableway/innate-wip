# Source: https://betterstack.com/community/guides/logging/crontab-logs/
# Original language: command
# Normalized: sh
# Block index: 2

tail -f /var/log/syslog | grep CRON