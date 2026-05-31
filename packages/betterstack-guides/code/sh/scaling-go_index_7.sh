# Source: https://betterstack.com/community/guides/scaling-go/index/
# Original language: command
# Normalized: sh
# Block index: 7

migrate -path repository/migrations/ -database "postgresql://postgres:admin@localhost:5432/go-blog?sslmode=disable" up