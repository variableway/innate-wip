# Source: https://betterstack.com/community/guides/logging/ssh-logging/
# Original language: command
# Normalized: sh
# Block index: 16

journalctl -u ssh --since "1 hour ago"