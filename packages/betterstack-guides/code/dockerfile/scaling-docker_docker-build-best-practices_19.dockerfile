# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 19

[label Dockerfile]
FROM node:22
ENV NODE_ENV=production
ENV APP_PORT=3000
ENV APP_VERSION=1.2.3