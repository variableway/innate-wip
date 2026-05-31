# Source: https://betterstack.com/community/guides/scaling-nodejs/vinejs-nodejs/
# Original language: command
# Normalized: sh
# Block index: 20

curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "J",
    "email": "invalid-email",
    "password": "pass",
    "password_confirmation": "",
    "address": {
      "street": "",
      "city": "",
      "zip": "abc"
    },
    "skills": []
  }'