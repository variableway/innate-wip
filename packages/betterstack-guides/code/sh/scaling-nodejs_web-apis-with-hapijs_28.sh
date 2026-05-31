# Source: https://betterstack.com/community/guides/scaling-nodejs/web-apis-with-hapijs/
# Original language: command
# Normalized: sh
# Block index: 28

curl -X PUT http://localhost:3000/api/posts/687f381d1ad899147070cfd9 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Hapi.js Features",
    "content": "This updated post covers advanced Hapi.js features including plugins, caching, and authentication."
  }'