# Source: https://betterstack.com/community/guides/scaling-nodejs/express-web-api/
# Original language: command
# Normalized: sh
# Block index: 31

curl -X PUT http://localhost:3000/api/posts/997e5cd6-277b-4b52-b9bd-ef63de18a28e \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Blog Post Title","content":"This content has been updated. Express makes updating API resources easy!","published":false}' \
  -s | jq