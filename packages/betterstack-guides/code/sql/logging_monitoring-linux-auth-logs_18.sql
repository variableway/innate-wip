# Source: https://betterstack.com/community/guides/logging/monitoring-linux-auth-logs/
# Original language: sql
# Normalized: sql
# Block index: 18

SELECT ip_address as "IP Address", countMerge(events_count) AS "Attempts"
FROM {{source}}
WHERE {{time}} BETWEEN {{start_time}} AND {{end_time}}
AND event_name = 'failed password'
AND ip_address IS NOT NULL
GROUP BY ip_address
ORDER BY "Attempts" DESC