# Source: https://betterstack.com/community/guides/logging/how-to-control-journald-with-journalctl/
# Original language: command
# Normalized: sh
# Block index: 54

sudo journalctl --vacuum-size=500M # shrink journal to 500 MB.