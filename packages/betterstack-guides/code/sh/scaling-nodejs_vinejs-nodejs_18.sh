# Source: https://betterstack.com/community/guides/scaling-nodejs/vinejs-nodejs/
# Original language: command
# Normalized: sh
# Block index: 18

curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane",
    "email": "jane@example.com",
    "password": "Password123",
    "password_confirmation": "Password123",
    "address": {
      "street": "123 Main St",
      "city": "Springfield",
      "zip": "12345"
    },
    "skills": ["JavaScript", "Node.js"]
  }'