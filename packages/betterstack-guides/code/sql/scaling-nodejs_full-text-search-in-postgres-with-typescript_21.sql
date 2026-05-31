# Source: https://betterstack.com/community/guides/scaling-nodejs/full-text-search-in-postgres-with-typescript/
# Original language: sql
# Normalized: sql
# Block index: 21

-- Find "Better Stack" as an exact phrase
SELECT * FROM articles 
WHERE search_vector @@ phraseto_tsquery('english', 'Better Stack');