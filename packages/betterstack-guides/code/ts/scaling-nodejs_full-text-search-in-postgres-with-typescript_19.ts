# Source: https://betterstack.com/community/guides/scaling-nodejs/full-text-search-in-postgres-with-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 19

sql<string>`ts_headline('english', ${articlesTable.body}, ${processedQuery}, 'StartSel=\x1b[1m, StopSel=\x1b[0m, MaxWords=30, MinWords=10')`