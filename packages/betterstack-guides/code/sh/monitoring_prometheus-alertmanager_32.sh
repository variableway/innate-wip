# Source: https://betterstack.com/community/guides/monitoring/prometheus-alertmanager/
# Original language: command
# Normalized: sh
# Block index: 32

amtool silence add -d 3h --comment="scheduled downtime" instance="web-server-1"