# Source: https://betterstack.com/community/guides/scaling-nodejs/full-text-search-in-postgres-with-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 18

sql<number>`ts_rank(${articlesTable.searchVector}, ${processedQuery}) as rank`