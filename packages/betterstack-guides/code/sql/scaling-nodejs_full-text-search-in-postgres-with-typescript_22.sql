# Source: https://betterstack.com/community/guides/scaling-nodejs/full-text-search-in-postgres-with-typescript/
# Original language: sql
# Normalized: sql
# Block index: 22

-- Find "application" within 3 words of "monitoring"
SELECT * FROM articles 
WHERE search_vector @@ to_tsquery('english', 'application <3> monitoring');