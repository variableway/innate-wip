# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 22

[label Dockerfile]
FROM node:22
# Using ADD for basic file copying is overkill
ADD ./app /app