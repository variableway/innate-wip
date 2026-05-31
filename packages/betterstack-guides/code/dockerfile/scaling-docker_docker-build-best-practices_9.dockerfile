# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 9

[label Dockerfile]
FROM node:22
WORKDIR /app
# Copy package files first
COPY package*.json ./
# Install dependencies
RUN npm install
# Then copy the rest of the code
COPY . .
CMD ["npm", "start"]