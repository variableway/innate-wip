# Source: https://betterstack.com/community/guides/scaling-nodejs/web-apis-with-hapijs/
# Original language: command
# Normalized: sh
# Block index: 34

curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Post to Delete",
    "content": "This post will be deleted to test the DELETE endpoint.",
    "author": "Test Author",
    "tags": ["test"]
  }'