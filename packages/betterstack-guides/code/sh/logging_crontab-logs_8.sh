# Source: https://betterstack.com/community/guides/logging/crontab-logs/
# Original language: bash
# Normalized: sh
# Block index: 8

[label script.sh]
#!/bin/bash

echo "===== Script started at $(date) ====="

# Your script commands here
backup_result=$(tar -czf /backup/data.tar.gz /var/www/data/)
if [ $? -eq 0 ]; then
   echo "[SUCCESS] Backup created successfully"
else
   echo "[ERROR] Backup failed with error: $backup_result"
fi

echo "===== Script completed at $(date) ====="