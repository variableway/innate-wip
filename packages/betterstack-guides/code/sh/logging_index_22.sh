# Source: https://betterstack.com/community/guides/logging/index/
# Original language: command
# Normalized: sh
# Block index: 22

sudo auditctl -w /etc/ssh/sshd_config -p wa -k ssh_config_changes