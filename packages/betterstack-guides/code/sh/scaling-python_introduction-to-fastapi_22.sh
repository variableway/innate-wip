# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-fastapi/
# Original language: command
# Normalized: sh
# Block index: 22

curl -X POST http://127.0.0.1:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Invalid Task","priority":10}' \
  | python3 -m json.tool