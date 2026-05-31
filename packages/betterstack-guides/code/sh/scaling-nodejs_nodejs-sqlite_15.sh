# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-sqlite/
# Original language: command
# Normalized: sh
# Block index: 15

curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"The Great Gatsby","author":"F. Scott Fitzgerald","isbn":"9780743273565","publishedYear":1925,"genre":"Classic","price":12.99}'