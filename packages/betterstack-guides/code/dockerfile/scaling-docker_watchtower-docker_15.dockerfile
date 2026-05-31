# Source: https://betterstack.com/community/guides/scaling-docker/watchtower-docker/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 15

[label Dockerfile]
FROM node:22-alpine
WORKDIR /app
CMD ["node", "-e", "console.log('Hello from v1'); setTimeout(() => {}, 3600000);"]