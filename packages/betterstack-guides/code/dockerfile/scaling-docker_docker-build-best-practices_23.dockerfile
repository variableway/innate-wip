# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 23

[label Dockerfile]
FROM node:22
# Use COPY for basic file copying from build context
COPY ./app /app