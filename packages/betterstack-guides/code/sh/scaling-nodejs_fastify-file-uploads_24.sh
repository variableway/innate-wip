# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-file-uploads/
# Original language: command
# Normalized: sh
# Block index: 24

curl -X POST \
  -F "file1=@test1.txt" \
  -F "file2=@test2.txt" \
  -F "file3=@test3.exe" \
  http://localhost:3000/upload/multiple