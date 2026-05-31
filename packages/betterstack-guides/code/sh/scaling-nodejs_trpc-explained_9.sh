# Source: https://betterstack.com/community/guides/scaling-nodejs/trpc-explained/
# Original language: command
# Normalized: sh
# Block index: 9

curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"C","email":"not-an-email"}'