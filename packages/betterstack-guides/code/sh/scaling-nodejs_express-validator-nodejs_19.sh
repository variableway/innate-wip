# Source: https://betterstack.com/community/guides/scaling-nodejs/express-validator-nodejs/
# Original language: command
# Normalized: sh
# Block index: 19

curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe", "email":"jane@unauthorized.com", "password":"securePass123"}'