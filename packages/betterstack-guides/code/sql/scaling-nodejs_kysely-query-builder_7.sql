# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-query-builder/
# Original language: sql
# Normalized: sql
# Block index: 7

CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price REAL NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE
)