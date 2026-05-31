# Source: https://betterstack.com/community/guides/linux/index/
# Original language: zsh
# Normalized: sh
# Block index: 7

#!/usr/bin/env zsh
# Example Zsh script demonstrating enhanced features

# Define variables similarly to Bash
USER_NAME="Admin"
LOG_FILE="/var/log/backup.log"

# Function with enhanced parameter handling
backup_data() {
    local source_dir="$1"
    local dest_dir="$2"
    
    print "Starting backup from $source_dir to $dest_dir"
    
    # Error handling with extended features
    rsync -av "$source_dir" "$dest_dir"
    if (( $? != 0 )); then
        print "Backup failed with error code $?" | tee -a "$LOG_FILE"
        return 1
    fi
    
    print "Backup completed successfully at $(date)" | tee -a "$LOG_FILE"
    return 0
}

# Enhanced argument handling
if (( $# < 2 )); then
    print "Usage: $0 <source_directory> <destination_directory>"
    exit 1
fi

# Array handling (note the different syntax)
typeset -a FAILED_ITEMS
typeset -A SUCCESS_MAP  # Associative array (not available in basic Bash)

# Main script execution
print "=== Backup Script Started by $USER_NAME ==="
backup_data "$1" "$2"
EXIT_CODE=$?

# Extended pattern matching and array operations
if (( EXIT_CODE != 0 )); then
    FAILED_ITEMS+=("$1")
    print "Failed items: ${(j:, :)FAILED_ITEMS}"  # Join array with commas
else
    SUCCESS_MAP[$1]="$(date)"  # Store success timestamp in associative array
    print "Successful backups:"
    for key val in "${(@kv)SUCCESS_MAP}"; do
        print "  - $key: $val"
    done
fi

exit $EXIT_CODE