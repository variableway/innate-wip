# Source: https://betterstack.com/community/guides/logging/monitoring-linux-auth-logs/
# Original language: sql
# Normalized: sql
# Block index: 19

SELECT {{time}} as "Timestamp", username as "User", ip_address as "IP Address", auth_method as "Auth method"
FROM {{source}}
WHERE {{time}} BETWEEN {{start_time}} AND {{end_time}}
  AND event_name = 'successful login'
ORDER BY "Timestamp" DESC