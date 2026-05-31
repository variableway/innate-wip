# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-litestar/
# Original language: sql
# Normalized: sql
# Block index: 18

sqlite> .tables
posts
sqlite> .schema posts
CREATE TABLE posts (
        id VARCHAR(36) NOT NULL, 
        title VARCHAR(100) NOT NULL, 
        content TEXT NOT NULL, 
        published BOOLEAN NOT NULL, 
        created_at DATETIME NOT NULL, 
        updated_at DATETIME NOT NULL, 
        PRIMARY KEY (id)
);
sqlite> .exit