# Source: https://betterstack.com/community/guides/logging/index/
# Original language: command
# Normalized: sh
# Block index: 20

grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -nr