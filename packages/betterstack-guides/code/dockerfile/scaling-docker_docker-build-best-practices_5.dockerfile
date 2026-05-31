# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 5

[label Dockerfile]
FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "index.js"]