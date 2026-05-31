# Source: https://betterstack.com/community/guides/scaling-nodejs/typeorm-v-mikroorm/
# Original language: bash
# Normalized: sh
# Block index: 10

# Create a migration based on your entity changes
typeorm migration:generate -n CreateUserTable

# Apply migrations to your database
typeorm migration:run