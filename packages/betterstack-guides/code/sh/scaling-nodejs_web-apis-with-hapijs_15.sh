# Source: https://betterstack.com/community/guides/scaling-nodejs/web-apis-with-hapijs/
# Original language: command
# Normalized: sh
# Block index: 15

curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Getting Started with Hapi.js",
    "content": "Hapi.js is a powerful Node.js framework for building scalable APIs. This post explores its key features and benefits.",
    "author": "John Developer",
    "tags": ["hapi", "nodejs", "api"]
  }'