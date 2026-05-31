# Source: https://betterstack.com/community/guides/logging/crontab-logs/
# Original language: bash
# Normalized: sh
# Block index: 23

[label secure-script.sh]
#!/bin/bash

# Don't log the API key
API_KEY="secret-value"

# Instead of: echo "Using API key: $API_KEY"
echo "Using API key: [REDACTED]"

# Process using the real value
curl -H "Authorization: Bearer $API_KEY" https://api.example.com/endpoint