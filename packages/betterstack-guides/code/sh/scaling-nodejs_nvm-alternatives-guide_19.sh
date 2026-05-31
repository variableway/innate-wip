# Source: https://betterstack.com/community/guides/scaling-nodejs/nvm-alternatives-guide/
# Original language: command
# Normalized: sh
# Block index: 19

# Build the image
docker build -t my-node-app .

# Run the container
docker run -p 3000:3000 my-node-app