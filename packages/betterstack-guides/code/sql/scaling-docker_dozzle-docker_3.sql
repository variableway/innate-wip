# Source: https://betterstack.com/community/guides/scaling-docker/dozzle-docker/
# Original language: sql
# Normalized: sql
# Block index: 3

[label log-query.sql]
SELECT * FROM logs WHERE message LIKE '%Error%' AND timestamp > '2023-10-27 10:00:00';