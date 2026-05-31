# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 20

[label Dockerfile]
FROM node:22
# Group related environment variables
ENV NODE_ENV=production \
   APP_PORT=3000 \
   APP_VERSION=1.2.3