# Source: https://betterstack.com/community/guides/scaling-nodejs/express-validator-nodejs/
# Original language: command
# Normalized: sh
# Block index: 24

curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"", "email":"invalid-email", "password":"123"}'