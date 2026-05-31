# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-flask/
# Original language: command
# Normalized: sh
# Block index: 49

curl -X POST http://127.0.0.1:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Post to Delete","content":"This post will be deleted to test the DELETE endpoint."}' \
  | python3 -m json.tool