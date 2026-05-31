# Source: https://betterstack.com/community/guides/logging/ssh-logging/
# Original language: command
# Normalized: sh
# Block index: 17

journalctl -u ssh --since "2023-07-01" --until "2023-07-12"