# Source: https://betterstack.com/community/guides/logging/how-to-control-journald-with-journalctl/
# Original language: command
# Normalized: sh
# Block index: 48

journalctl --unit ssh.service --grep 'Invalid user' --since '1 hour ago'