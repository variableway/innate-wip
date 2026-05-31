# Source: https://betterstack.com/community/guides/scaling-nodejs/express-web-api/
# Original language: command
# Normalized: sh
# Block index: 36

curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Post to Delete","content":"This post will be deleted to test the DELETE endpoint."}' \
  -s | jq