# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 4

[label Dockerfile]
FROM node:22-alpine
WORKDIR /app

# Copy dependency files first
COPY package.json package-lock.json ./

# Install dependencies in a separate layer
RUN npm ci --production

# Copy application code (changes frequently)
COPY . .

EXPOSE 3000
CMD ["node", "index.js"]