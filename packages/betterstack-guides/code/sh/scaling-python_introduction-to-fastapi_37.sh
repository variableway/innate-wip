# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-fastapi/
# Original language: command
# Normalized: sh
# Block index: 37

curl -X PUT "http://127.0.0.1:8000/api/tasks/<your_task_id>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn FastAPI in Depth","description":"Complete the advanced FastAPI tutorial","priority":4,"completed":true}' \
  | python3 -m json.tool