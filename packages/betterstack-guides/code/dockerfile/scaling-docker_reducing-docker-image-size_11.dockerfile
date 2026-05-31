# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 11

[label Dockerfile]
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
[highlight]
RUN npm ci --production
[/highlight]
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]