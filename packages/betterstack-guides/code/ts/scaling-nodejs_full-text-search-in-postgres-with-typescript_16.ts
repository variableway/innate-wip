# Source: https://betterstack.com/community/guides/scaling-nodejs/full-text-search-in-postgres-with-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 16

const processedQuery = sql`to_tsquery('english', ${query.replace(/\s+/g, ' & ')})`;