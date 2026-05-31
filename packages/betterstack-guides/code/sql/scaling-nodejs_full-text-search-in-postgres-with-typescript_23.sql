# Source: https://betterstack.com/community/guides/scaling-nodejs/full-text-search-in-postgres-with-typescript/
# Original language: sql
# Normalized: sql
# Block index: 23

-- Find articles about logging but not performance
SELECT * FROM articles 
WHERE search_vector @@ to_tsquery('english', 'logging & !performance');