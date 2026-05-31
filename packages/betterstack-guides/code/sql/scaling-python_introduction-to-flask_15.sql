# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-flask/
# Original language: sql
# Normalized: sql
# Block index: 15

sqlite> .tables
posts
sqlite> .schema posts
CREATE TABLE posts (
        id VARCHAR(36) NOT NULL, 
        title VARCHAR(100) NOT NULL, 
        content TEXT NOT NULL, 
        published BOOLEAN, 
        created_at DATETIME, 
        updated_at DATETIME, 
        PRIMARY KEY (id)
);
sqlite> .exit