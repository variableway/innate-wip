# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-vs-knexjs/
# Original language: bash
# Normalized: sh
# Block index: 10

npx knex migrate:latest  # Apply pending migrations
npx knex migrate:rollback  # Undo last batch