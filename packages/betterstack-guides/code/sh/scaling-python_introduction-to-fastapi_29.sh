# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-fastapi/
# Original language: command
# Normalized: sh
# Block index: 29

curl "http://127.0.0.1:8000/api/tasks/?completed=true" | python3 -m json.tool