# Source: https://betterstack.com/community/guides/scaling-nodejs/vinejs-nodejs/
# Original language: command
# Normalized: sh
# Block index: 6

curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe", "email":"john@example.com", "password":"password123"}'