# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-fastapi/
# Original language: command
# Normalized: sh
# Block index: 25

curl -X POST http://127.0.0.1:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn FastAPI","description":"Complete the FastAPI tutorial and build a project","priority":2}' \
  | python3 -m json.tool