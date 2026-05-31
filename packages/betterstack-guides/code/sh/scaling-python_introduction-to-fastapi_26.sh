# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-fastapi/
# Original language: command
# Normalized: sh
# Block index: 26

curl -X POST http://127.0.0.1:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Write Documentation","description":"Document the API endpoints and models","priority":3,"completed":true}' \
  | python3 -m json.tool