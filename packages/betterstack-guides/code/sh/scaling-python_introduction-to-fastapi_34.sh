# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-fastapi/
# Original language: command
# Normalized: sh
# Block index: 34

curl "http://127.0.0.1:8000/api/tasks/non-existent-id" | python3 -m json.tool