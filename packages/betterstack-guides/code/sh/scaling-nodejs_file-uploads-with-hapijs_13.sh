# Source: https://betterstack.com/community/guides/scaling-nodejs/file-uploads-with-hapijs/
# Original language: command
# Normalized: sh
# Block index: 13

echo "fake image content" > test.jpg
curl -X POST -F "file=@test.jpg" http://localhost:3000/upload/single