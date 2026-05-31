# Source: https://betterstack.com/community/guides/logging/monitoring-linux-auth-logs/
# Original language: sql
# Normalized: sql
# Block index: 17

SELECT username as "User", countMerge(events_count) AS "Attempts"
FROM {{source}}
WHERE {{time}} BETWEEN {{start_time}} AND {{end_time}}
AND event_name = 'failed password'
AND username IS NOT NULL
GROUP BY username
ORDER BY "Attempts" DESC