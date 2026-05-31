# Source: https://betterstack.com/community/guides/logging/crontab-logs/
# Original language: bash
# Normalized: sh
# Block index: 14

[label critical-task.sh]
#!/bin/bash

# Run the actual task and capture its exit status
/path/to/important-script.sh
EXIT_STATUS=$?

# If it failed, send an immediate notification
if [ $EXIT_STATUS -ne 0 ]; then
   echo "Critical task failed at $(date)" | mail -s "URGENT: Cron Job Failure" admin@example.com
fi

# Always log the result to our custom log
echo "$(date) - Task completed with status $EXIT_STATUS" >> /var/log/critical-tasks.log

# Pass through the original exit status
exit $EXIT_STATUS