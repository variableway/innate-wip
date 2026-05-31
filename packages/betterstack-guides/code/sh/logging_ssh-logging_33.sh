# Source: https://betterstack.com/community/guides/logging/ssh-logging/
# Original language: command
# Normalized: sh
# Block index: 33

grep "Accepted" /var/log/auth.log | awk '{print $1,$2,$3,$9,$11}' | sort