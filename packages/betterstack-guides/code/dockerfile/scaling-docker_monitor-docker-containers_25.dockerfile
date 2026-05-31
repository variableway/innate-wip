# Source: https://betterstack.com/community/guides/scaling-docker/monitor-docker-containers/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 25

[label Dockerfile]
FROM node:22-alpine
WORKDIR /app

[highlight]
# Install curl for health checks
RUN apk add --no-cache curl
[/highlight]

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000

[highlight]
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
[/highlight]

CMD ["npm", "start"]