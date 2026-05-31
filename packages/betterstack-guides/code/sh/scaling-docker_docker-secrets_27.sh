# Source: https://betterstack.com/community/guides/scaling-docker/docker-secrets/
# Original language: bash
# Normalized: sh
# Block index: 27

[label fetch-secrets.sh]
#!/bin/bash

# Fetch secret from AWS Secrets Manager
secret=$(aws secretsmanager get-secret-value \
    --secret-id myapp/database/credentials \
    --query SecretString \
    --output text)

# Parse and store the secret
echo $secret | jq -r .password > /run/secrets/db_password