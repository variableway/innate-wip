# Source: https://betterstack.com/community/guides/logging/how-to-control-journald-with-journalctl/
# Original language: command
# Normalized: sh
# Block index: 31

journalctl --unit rsyslog.service --unit nginx.service --since '1 hour ago'