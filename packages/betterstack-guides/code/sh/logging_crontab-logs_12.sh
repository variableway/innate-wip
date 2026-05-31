# Source: https://betterstack.com/community/guides/logging/crontab-logs/
# Original language: bash
# Normalized: sh
# Block index: 12

[label monitor-cron.sh]
#!/bin/bash

# Define the log file to check based on your system
LOG_FILE="/var/log/syslog"

# Check for non-zero exit statuses in the last day
FAILED_JOBS=$(grep "CRON" $LOG_FILE | grep -v "exit status: 0" | grep "$(date -d "1 day ago" "+%b %d")")

if [ -n "$FAILED_JOBS" ]; then
   echo "Failed cron jobs detected:"
   echo "$FAILED_JOBS"
   # You could add code here to send notifications
   # e.g., mail -s "Cron job failures" admin@example.com <<< "$FAILED_JOBS"
   exit 1
else
   echo "All cron jobs completed successfully"
   exit 0
fi