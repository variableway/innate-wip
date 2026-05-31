# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 8

[label Dockerfile]
FROM node:22
WORKDIR /app
# This copies everything including code that changes frequently
COPY . .
RUN npm install
CMD ["npm", "start"]