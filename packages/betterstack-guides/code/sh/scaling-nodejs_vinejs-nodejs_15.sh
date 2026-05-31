# Source: https://betterstack.com/community/guides/scaling-nodejs/vinejs-nodejs/
# Original language: command
# Normalized: sh
# Block index: 15

curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"J", "email":"not-an-email", "password":"password"}'