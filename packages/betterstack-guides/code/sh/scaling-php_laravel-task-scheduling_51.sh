# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: bash
# Normalized: sh
# Block index: 51

[label scripts/backup.sh]
#!/usr/bin/env bash

# Get current date in yyyy-mm-dd format
NOW=$(date "+%Y-%m-%d")

# If backup directory does not exist, create one
if [ ! -d "backup" ]; then
    mkdir "backup"
fi

# Copy database.sqlite into backup directory
cp "database.sqlite" "backup/${NOW}-database.sqlite"

# Find and delete files older than 7 days
find "backup" -type f -mtime +7 -delete