# Source: https://betterstack.com/community/guides/monitoring/monitor-linux-prometheus-node-exporter/
# Original language: bash
# Normalized: sh
# Block index: 14

[label uptime-script.sh]
#!/bin/bash

# Define the output directory and files
OUTPUT_DIR="textfiles"
TMP_METRIC_FILE="/tmp/uptime.prom"
METRIC_FILE="$OUTPUT_DIR/uptime.prom"

# Ensure the output directory exists
mkdir -p "$OUTPUT_DIR"

# Collect custom metrics
# Example: Capture system uptime in seconds
UPTIME_SECONDS=$(awk '{print $1}' /proc/uptime)

# Define custom metrics
METRIC_NAME="system_uptime_seconds"
METRIC_HELP="# HELP $METRIC_NAME The system uptime in seconds"
METRIC_TYPE="# TYPE $METRIC_NAME gauge"

# Write metrics to the temporary file
{
  echo "$METRIC_HELP"
  echo "$METRIC_TYPE"
  echo "$METRIC_NAME $UPTIME_SECONDS"
} > "$TMP_METRIC_FILE"

# Move the temporary file to the final directory atomically
mv "$TMP_METRIC_FILE" "$METRIC_FILE"

# Print success message
echo "Uptime written to $METRIC_FILE"