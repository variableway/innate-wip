# Source: https://betterstack.com/community/guides/scaling-nodejs/typeorm-v-mikroorm/
# Original language: bash
# Normalized: sh
# Block index: 12

# Create a migration from schema changes
npx mikro-orm migration:create --name CreateUserTable

# Apply migrations
npx mikro-orm migration:up