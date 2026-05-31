# Source: https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/
# Original language: bash
# Normalized: sh
# Block index: 12

[label logify.sh]
#!/bin/bash

logfile="/var/log/logify/log_records.log"

# Function to generate a random log record
generate_log_record() {
    local loglevel=("INFO" "WARNING" "ERROR")
    local services=("web" "database" "app" "network")
    local timestamps=$(date +"%Y-%m-%d %H:%M:%S")
    local random_level=${loglevel[$RANDOM % ${#loglevel[@]}]}
    local random_service=${services[$RANDOM % ${#services[@]}]}
    local message="This is a sample log record for ${random_service} service."

    echo "${timestamps} [${random_level}] ${message}"
}

# Main loop to write log records every second
while true; do
    log_record=$(generate_log_record)
    echo "${log_record}" >> "${logfile}"
    sleep 1
done