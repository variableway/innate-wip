# Source: https://betterstack.com/community/guides/logging/crontab-logs/
# Original language: bash
# Normalized: sh
# Block index: 17

[label crontab]
#!/bin/bash

# Start time for duration calculation
START_TIME=$(date +%s)

# Run the actual task
/path/to/original-script.sh
EXIT_STATUS=$?

# Calculate duration
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Send status to monitoring system
[highlight]
curl https://uptime.betterstack.com/api/v1/heartbeat/<heartbeat_id>
[/highlight]

# Exit with the original status
exit $EXIT_STATUS