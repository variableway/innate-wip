# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 12

[label Dockerfile]
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
# Install all dependencies including dev
RUN npm ci
COPY . .
# Build with dev dependencies available
RUN npm run build
# Remove dev dependencies afterward
[highlight]
RUN npm prune --production
[/highlight]
EXPOSE 3000
CMD ["node", "dist/main.js"]