# Source: https://betterstack.com/community/guides/scaling-go/index/
# Original language: sql
# Normalized: sql
# Block index: 5

[label repository/migrations/000001_create_posts_table.up.sql]
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);