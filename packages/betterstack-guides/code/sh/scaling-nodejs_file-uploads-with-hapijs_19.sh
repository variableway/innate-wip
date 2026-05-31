# Source: https://betterstack.com/community/guides/scaling-nodejs/file-uploads-with-hapijs/
# Original language: command
# Normalized: sh
# Block index: 19

curl -X POST \
  -F "files=@test1.txt" \
  -F "files=@test2.json" \
  -F "files=@test3.jpg" \
  http://localhost:3000/upload/multiple