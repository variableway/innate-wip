# Source: https://betterstack.com/community/guides/monitoring/promql/
# Original language: promql
# Normalized: js
# Block index: 21

(1 - node_memory_MemFree_bytes / node_memory_MemTotal_bytes) * 100