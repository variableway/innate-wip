# Source: https://betterstack.com/community/guides/scaling-nodejs/express-web-api/
# Original language: command
# Normalized: sh
# Block index: 33

curl -X PUT http://localhost:3000/api/posts/997e5cd6-277b-4b52-b9bd-ef63de18a28e \
  -H "Content-Type: application/json" \
  -d '{"title":"Hi","content":"This content is valid but the title is too short."}' \
  -s | jq