# Source: https://betterstack.com/community/guides/scaling-nodejs/express-validator-nodejs/
# Original language: command
# Normalized: sh
# Block index: 12

curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"", "email":"not-an-email", "password":"123"}'