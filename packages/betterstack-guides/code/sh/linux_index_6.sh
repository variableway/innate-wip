# Source: https://betterstack.com/community/guides/linux/index/
# Original language: bash
# Normalized: sh
# Block index: 6

#!/bin/bash
# Example Bash script demonstrating common patterns

# Define variables
USER_NAME="Admin"
LOG_FILE="/var/log/backup.log"

# Function definition
backup_data() {
    local source_dir="$1"
    local dest_dir="$2"
    
    echo "Starting backup from $source_dir to $dest_dir"
    
    # Error handling with exit codes
    rsync -av "$source_dir" "$dest_dir"
    if [ $? -ne 0 ]; then
        echo "Backup failed with error code $?" | tee -a "$LOG_FILE"
        return 1
    fi
    
    echo "Backup completed successfully at $(date)" | tee -a "$LOG_FILE"
    return 0
}

# Command-line argument handling
if [ $# -lt 2 ]; then
    echo "Usage: $0 <source_directory> <destination_directory>"
    exit 1
fi

# Main script execution
echo "=== Backup Script Started by $USER_NAME ==="
backup_data "$1" "$2"
EXIT_CODE=$?

# Using arrays
FAILED_ITEMS=()
if [ $EXIT_CODE -ne 0 ]; then
    FAILED_ITEMS+=("$1")
    echo "Failed items: ${FAILED_ITEMS[*]}"
fi

exit $EXIT_CODE