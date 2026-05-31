# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 6

[label Dockerfile]
FROM node:22.1.0
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "index.js"]